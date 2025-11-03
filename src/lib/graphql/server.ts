/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

import { logger } from "@/lib/logging";
import { performanceTracker } from "@/lib/logging/performance";

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
>(
  query: string,
  variables: TVariables,
  headers: Record<string, string> = {},
  opts?: { correlationId?: string; source?: string }
): Promise<TData> {
  const correlationId = opts?.correlationId;
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

      const fetchMarkName = correlationId ? `fetch-graphql-api:${correlationId}` : "fetch-graphql-api";
      performanceTracker.start(fetchMarkName);
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          query,
          variables,
        }),
      });
      performanceTracker.end(fetchMarkName, {
        status: response.status,
        ok: response.ok,
        ...(correlationId && { correlationId }),
        ...(operationName && { operationName }),
        ...(operationType && { operationType }),
        ...(opts?.source && { source: opts.source }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parseMarkName = correlationId ? `parse-graphql-response:${correlationId}` : "parse-graphql-response";
      performanceTracker.start(parseMarkName);
      const result: GraphQLResponse<TData> = await response.json();
      performanceTracker.end(parseMarkName, {
        ...(correlationId && { correlationId }),
        ...(operationName && { operationName }),
        ...(operationType && { operationType }),
        ...(opts?.source && { source: opts.source }),
      });

      if (result.errors) {
        logger.error("GraphQL errors", {
          errors: result.errors,
          component: "executeServerGraphQLQuery",
          ...(correlationId && { correlationId }),
          ...(operationName && { operationName }),
          ...(operationType && { operationType }),
          ...(opts?.source && { source: opts.source }),
        });
        throw new Error(`GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`);
      }

      return result.data;
    },
    {
      queryLength: query.length,
      hasVariables: Object.keys(variables).length > 0,
      ...(correlationId && { correlationId }),
      ...(operationName && { operationName }),
      ...(operationType && { operationType }),
      ...(opts?.source && { source: opts.source }),
    }
  );
}
