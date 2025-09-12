/**
 * パス判定に関するユーティリティ関数
 */

/**
 * パスがワイルドカードパターンにマッチするかどうかを判定
 * @param pathname 判定対象のパス
 * @param patterns マッチングパターン（ワイルドカード対応）
 * @returns マッチした場合はtrue
 */
function matchPaths(pathname: string, ...patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('/*')) {
      const basePath = pattern.slice(0, -2);
      return pathname === basePath || pathname.startsWith(`${basePath}/`);
    }
    return pathname === pattern;
  });
}

/**
 * 保護されたパス（認証が必要なパス）かどうかを判定
 * @param pathname 判定対象のパス
 * @returns 保護されたパスの場合はtrue
 */
export function isProtectedPath(pathname: string): boolean {
  const protectedPaths = [
    "/users/me",
    "/tickets",
    "/wallets",
    "/wallets/*",
    "/admin",
    "/admin/*",
    "/participations/*"
  ];
  return matchPaths(pathname, ...protectedPaths);
}
