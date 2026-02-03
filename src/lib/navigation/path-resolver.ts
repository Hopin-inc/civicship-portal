/**
 * Path Resolver - パス解決ユーティリティ
 *
 * サブドメイン形式（a.shippin.jp/settings）からパス形式（shippin.jp/c/a/settings）への
 * 移行期間中に、コード変更なしでパス生成を切り替えるための抽象化レイヤー
 *
 * PR 1.5: このファイルを導入し、全てのパス生成をこの関数経由にする
 * PR 2.0: IS_PATH_BASED_MODE を true にするだけで移行完了
 */

import { matchPaths } from "@/utils/path";

/**
 * パスベースルーティングを有効にするフラグ
 * PR 2.0 で true に切り替える
 */
const IS_PATH_BASED_MODE =
  process.env.NEXT_PUBLIC_ENABLE_PATH_BASED_ROUTING === "true";

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

  // 認証関連（認証フローはサブドメインで行う）
  "/login",
  "/login/**",
  "/sign-up",
  "/sign-up/**",
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
 * // IS_PATH_BASED_MODE = false の場合
 * resolvePath("/settings", "community-a") // => "/settings"
 *
 * // IS_PATH_BASED_MODE = true の場合
 * resolvePath("/settings", "community-a") // => "/c/community-a/settings"
 * resolvePath("/", "community-a") // => "/c/community-a"
 * resolvePath("/api/users", "community-a") // => "/api/users" (除外対象)
 */
export function resolvePath(
  path: string,
  communityId: string | null
): string {
  // パスベースモードでない場合、またはcommunityIdがない場合はそのまま返す
  if (!IS_PATH_BASED_MODE || !communityId) {
    return path;
  }

  // 除外対象のパスはそのまま返す
  if (isExcludedPath(path)) {
    return path;
  }

  // クエリパラメータとハッシュを分離
  const { pathname, queryAndHash } = splitPath(path);

  // パスを正規化（先頭に / を確保）
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  // /c/communityId プレフィックスを付与
  const resolvedPathname =
    normalizedPathname === "/"
      ? `/c/${communityId}`
      : `/c/${communityId}${normalizedPathname}`;

  return resolvedPathname + queryAndHash;
}

/**
 * パスベースモードが有効かどうかを取得
 */
export function isPathBasedModeEnabled(): boolean {
  return IS_PATH_BASED_MODE;
}

/**
 * 除外パターンのリストを取得（テスト・デバッグ用）
 */
export function getExcludedPathPatterns(): readonly string[] {
  return EXCLUDED_PATH_PATTERNS;
}
