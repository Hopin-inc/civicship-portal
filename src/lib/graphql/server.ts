/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

import { logger } from "@/lib/logging";

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
  }>;
}

/**
 * サーバーサイドでGraphQLクエリを実行する関数
 */
export async function executeServerGraphQLQuery<
  TData = unknown,
  TVariables = Record<string, unknown>,
>(query: string, variables: TVariables, headers: Record<string, string> = {}): Promise<TData> {
  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Auth-Mode": "session",
    "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
    "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
    ...headers,
  };

  logger.info("[GraphQL] executeServerGraphQLQuery: sending request", {
    endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    authMode: requestHeaders["X-Auth-Mode"],
    hasCookie: !!requestHeaders["cookie"],
    cookieLength: requestHeaders["cookie"]?.length ?? 0,
    headerKeys: Object.keys(requestHeaders),
    component: "executeServerGraphQLQuery",
  });

  const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    logger.error("[GraphQL] executeServerGraphQLQuery: HTTP error", {
      status: response.status,
      statusText: response.statusText,
      component: "executeServerGraphQLQuery",
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<TData> = await response.json();

  logger.info("[GraphQL] executeServerGraphQLQuery: response received", {
    hasData: !!result.data,
    hasErrors: !!result.errors,
    errorCount: result.errors?.length ?? 0,
    component: "executeServerGraphQLQuery",
  });

  if (result.errors) {
    logger.error("[GraphQL] executeServerGraphQLQuery: GraphQL errors", {
      errors: result.errors,
      component: "executeServerGraphQLQuery",
    });
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
  }

  return result.data;
}
