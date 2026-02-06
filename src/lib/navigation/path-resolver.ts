/**
 * Path Resolver - パス解決ユーティリティ
 *
 * パスベース・ルーティング（/community/[communityId]/...）のためのパス解決を行う
 * communityId がある場合は /community/{communityId}{path} 形式に変換する
 */

import { matchPaths } from "@/utils/path";

/**
 * パス・リゾルバーを通すべきでないパスのパターン
 * これらのパスは communityId プレフィックスを付けない
 */
const EXCLUDED_PATH_PATTERNS = [
  // Next.js 内部
  "_next/**",
  "favicon.ico",

  // 静的アセット
  "/images/**",
  "/communities/**",
  "/icons/**",

  // API ルート
  "/api/**",
];

/**
 * 外部URLかどうかを判定
 */
function isExternalUrl(path: string): boolean {
  return /^(https?:)?\/\//.test(path);
}

/**
 * リゾルバーを適用すべきでないパスかどうかを判定
 */
function isExcludedPath(path: string): boolean {
  // 外部URLは除外
  if (isExternalUrl(path)) {
    return true;
  }

  // 除外パターンに一致するか確認
  return matchPaths(path, ...EXCLUDED_PATH_PATTERNS);
}

/**
 * パスからクエリパラメータとハッシュを分離
 */
function splitPath(path: string): {
  pathname: string;
  queryAndHash: string;
} {
  const queryStart = path.indexOf("?");
  const hashStart = path.indexOf("#");

  let endOfPathname = path.length;
  if (queryStart !== -1 && hashStart !== -1) {
    endOfPathname = Math.min(queryStart, hashStart);
  } else if (queryStart !== -1) {
    endOfPathname = queryStart;
  } else if (hashStart !== -1) {
    endOfPathname = hashStart;
  }

  return {
    pathname: path.slice(0, endOfPathname),
    queryAndHash: path.slice(endOfPathname),
  };
}

/**
 * 動的パス解決
 *
 * @param path - 元のパス（例: "/settings", "/users/123"）
 * @param communityId - コミュニティID（例: "community-a"）
 * @returns 解決されたパス
 *
 * @example
 * resolvePath("/settings", "community-a") // => "/community/community-a/settings"
 * resolvePath("/", "community-a") // => "/community/community-a"
 * resolvePath("/api/users", "community-a") // => "/api/users" (除外対象)
 * resolvePath("/terms", "community-a") // => "/terms" (除外対象)
 */
export function resolvePath(
  path: string,
  communityId: string | null
): string {
  // communityId の検証（パストラバーサル/オープンリダイレクト対策）
  // 英数字とハイフンのみ許可
  if (!communityId || !/^[a-zA-Z0-9-]+$/.test(communityId)) {
    return path;
  }

  // クエリパラメータとハッシュを分離
  const { pathname, queryAndHash } = splitPath(path);

  // パスを正規化（先頭に / を確保）
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  // 既に /community/ で始まるパスは二重処理しない
  if (normalizedPathname.startsWith("/community/")) {
    return path;
  }

  // 除外対象のパスはそのまま返す
  // 元のパス（favicon.ico等）と正規化後のパス（/terms等）の両方でチェック
  if (isExcludedPath(path) || isExcludedPath(normalizedPathname)) {
    return path;
  }

  // /community/communityId プレフィックスを付与
  const resolvedPathname =
    normalizedPathname === "/"
      ? `/community/${communityId}`
      : `/community/${communityId}${normalizedPathname}`;

  return resolvedPathname + queryAndHash;
}

/**
 * 除外パターンのリストを取得（テスト・デバッグ用）
 */
export function getExcludedPathPatterns(): readonly string[] {
  return EXCLUDED_PATH_PATTERNS;
}
