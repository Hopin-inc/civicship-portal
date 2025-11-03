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

/**
 * クエリの短いハッシュを生成（operationNameが取得できない場合のフォールバック）
 */
function generateQueryHash(query: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(query.length, 100); i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

/**
 * ユニークなマーク名を生成
 */
function generateMarkName(
  baseName: string,
  correlationId: string | undefined,
  operationName: string | null,
  source: string | undefined,
  query?: string
): string {
  if (!correlationId) {
    return baseName;
  }

  const op = operationName || (query ? `hash_${generateQueryHash(query)}` : "unknown");
  const src = source || "unknown";
  const uniq = Math.random().toString(36).slice(2, 6);
  
  return `${baseName}:${correlationId}:${op}:${src}:${uniq}`;
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

      const fetchMarkName = generateMarkName(
        "fetch-graphql-api",
        correlationId,
        operationName,
        opts?.source,
        query
      );
      const fetchMarkId = operationName || generateQueryHash(query);
      
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
        markId: `fetch:${fetchMarkId}`,
        ...(correlationId && { correlationId }),
        ...(operationName && { operationName }),
        ...(operationType && { operationType }),
        ...(opts?.source && { source: opts.source }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const parseMarkName = generateMarkName(
        "parse-graphql-response",
        correlationId,
        operationName,
        opts?.source,
        query
      );
      const parseMarkId = operationName || generateQueryHash(query);
      
      performanceTracker.start(parseMarkName);
      const result: GraphQLResponse<TData> = await response.json();
      performanceTracker.end(parseMarkName, {
        markId: `parse:${parseMarkId}`,
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
