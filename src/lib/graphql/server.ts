/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

import { logger } from "@/lib/logging";

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export async function executeServerGraphQLQuery<
  TData = unknown,
  TVariables = Record<string, unknown>,
>(
  query: string,
  variables: TVariables,
  headers: Record<string, string> = {},
  timeoutMs: number = 5000, // ← ★ タイムアウト（デフォルト5秒）
): Promise<TData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Auth-Mode": "session",
    "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
    "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
    ...headers,
  };

  let response: Response;

  try {
    response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal, // ← ★重要
    });
  } catch (err: any) {
    clearTimeout(timeout);

    // タイムアウトの場合
    if (err.name === "AbortError") {
      logger.error("GraphQL request timeout", {
        query,
        variables,
        timeoutMs,
        component: "executeServerGraphQLQuery",
      });
      throw new Error(`GraphQL request timeout after ${timeoutMs}ms`);
    }

    throw err;
  }

  clearTimeout(timeout);

  // HTTP エラー（403 など）
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    logger.error("GraphQL HTTP error", {
      status: response.status,
      body: text,
      component: "executeServerGraphQLQuery",
    });
    throw new Error(`GraphQL HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse<TData> = await response.json();

  // GraphQL エラー
  if (result.errors) {
    logger.error("GraphQL errors", {
      errors: result.errors,
      component: "executeServerGraphQLQuery",
    });
    throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
  }

  return result.data;
}
