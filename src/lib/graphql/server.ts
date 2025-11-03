/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

import { logger } from "@/lib/logging";
import { performanceTracker } from "@/lib/logging/performance";
import { getCorrelationId } from "@/lib/logging/request-context";

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
/**
 * GraphQLクエリから操作名と操作タイプを抽出
 */
function extractOperationInfo(query: string): {
  operationName: string | null;
  operationType: string | null;
} {
  const match = query.match(/\b(query|mutation)\s+([A-Za-z0-9_]+)/);
  if (match) {
    return {
      operationType: match[1],
      operationName: match[2],
    };
  }
  return {
    operationType: null,
    operationName: null,
  };
}

export async function executeServerGraphQLQuery<
  TData = unknown,
  TVariables = Record<string, unknown>,
>(query: string, variables: TVariables, headers: Record<string, string> = {}): Promise<TData> {
  const correlationId = await getCorrelationId();
  const { operationName, operationType } = extractOperationInfo(query);

  return performanceTracker.measure(
    "GraphQL Query Execution",
    async () => {
      const requestHeaders = {
        "Content-Type": "application/json",
        "X-Auth-Mode": "session",
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
        "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
        ...headers,
      };

      performanceTracker.start(`fetch-graphql-api:${correlationId}`);
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          query,
          variables,
        }),
      });
      performanceTracker.end(`fetch-graphql-api:${correlationId}`, {
        status: response.status,
        ok: response.ok,
        correlationId,
        operationName,
        operationType,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      performanceTracker.start(`parse-graphql-response:${correlationId}`);
      const result: GraphQLResponse<TData> = await response.json();
      performanceTracker.end(`parse-graphql-response:${correlationId}`, {
        correlationId,
        operationName,
        operationType,
      });

      if (result.errors) {
        logger.error("GraphQL errors", {
          errors: result.errors,
          component: "executeServerGraphQLQuery",
          correlationId,
          operationName,
          operationType,
        });
        throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
      }

      return result.data;
    },
    {
      queryLength: query.length,
      hasVariables: Object.keys(variables).length > 0,
      correlationId,
      operationName,
      operationType,
    }
  );
}
