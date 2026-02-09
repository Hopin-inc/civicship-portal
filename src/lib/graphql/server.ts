/**
 * サーバーサイド用のGraphQLクエリ実行ヘルパー関数
 */

import { logger } from "@/lib/logging";

/**
 * サーバーサイドでリクエストヘッダーを自動解決する
 * - X-Community-Id: ミドルウェアが設定したヘッダーから取得
 * - cookie: Next.js の cookies() から取得
 *
 * Note: next/headers は動的インポートを使用。
 * クライアントコンポーネントから間接的にインポートされてもビルドエラーを回避。
 */
async function resolveServerHeaders(
  providedHeaders?: Record<string, string>
): Promise<Record<string, string>> {
  const resolved: Record<string, string> = { ...providedHeaders };

  try {
    // 動的インポートでサーバー専用モジュールを読み込み
    const { headers, cookies } = await import("next/headers");

    // X-Community-Id が未設定の場合、headers() から自動取得
    const hasCommunityId = Object.keys(resolved).some(
      (key) => key.toLowerCase() === "x-community-id"
    );
    if (!hasCommunityId) {
      const headersList = await headers();
      const communityId = headersList.get("x-community-id");
      if (communityId) {
        resolved["X-Community-Id"] = communityId;
      }
    }

    // cookie が未設定の場合、cookies() から自動取得（case-insensitive）
    const hasCookie = Object.keys(resolved).some(
      (key) => key.toLowerCase() === "cookie"
    );
    if (!hasCookie) {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        resolved.cookie = cookieHeader;
      }
    }
  } catch (error) {
    // ビルド時など headers()/cookies() が使えない場合は無視
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    if (isBuildPhase) {
      logger.debug("[resolveServerHeaders] Could not resolve headers automatically (build phase)", {
        error: (error as Error).message,
        component: "resolveServerHeaders",
      });
    } else {
      logger.warn("[resolveServerHeaders] Could not resolve headers automatically at runtime", {
        error: (error as Error).message,
        component: "resolveServerHeaders",
      });
    }
  }

  return resolved;
}

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
  providedHeaders: Record<string, string> = {},
  timeoutMs: number = 5000, // ← ★ タイムアウト（デフォルト5秒）
): Promise<TData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // ヘッダーを自動解決（X-Community-Id, cookie）
  const resolvedHeaders = await resolveServerHeaders(providedHeaders);

  // X-Community-Id のログ（HTTP ヘッダーは大文字小文字を区別しない）
  const communityIdKey = Object.keys(resolvedHeaders).find(
    (key) => key.toLowerCase() === "x-community-id"
  );
  const communityId = communityIdKey ? resolvedHeaders[communityIdKey] : undefined;

  // クエリ名を抽出 (例: "query CommunityPortalConfig" → "CommunityPortalConfig")
  const queryNameMatch = query.match(/(?:query|mutation)\s+(\w+)/);
  const queryName = queryNameMatch?.[1] ?? query.substring(0, 60);

  const communityIdSource = Object.keys(providedHeaders).some(
    (key) => key.toLowerCase() === "x-community-id"
  )
    ? "provided"
    : communityId
      ? "auto-resolved"
      : "missing";

  if (!communityId) {
    logger.warn("[executeServerGraphQLQuery] No X-Community-Id in headers", {
      queryName,
      communityIdSource,
      hasCookie: Object.keys(resolvedHeaders).some((k) => k.toLowerCase() === "cookie"),
      component: "executeServerGraphQLQuery",
    });
  } else {
    logger.info("[executeServerGraphQLQuery] Request", {
      communityId,
      queryName,
      communityIdSource,
      component: "executeServerGraphQLQuery",
    });
  }

  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Auth-Mode": "session",
    ...resolvedHeaders,
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
