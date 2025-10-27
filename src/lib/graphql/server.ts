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

  logger.info("[executeServerGraphQLQuery] SSR Request", {
    authMode: requestHeaders["X-Auth-Mode"],
    hasAuthorization: !!requestHeaders.Authorization,
    authSuffix: requestHeaders.Authorization?.slice(-8),
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<TData> = await response.json();

  if (result.errors) {
    logger.error("GraphQL errors", {
      errors: result.errors,
      component: "executeServerGraphQLQuery",
    });
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
  }

  return result.data;
}
