/**
 * 認証設定
 * 特定のページでのみLIFF認証を実行するための設定
 */

// LIFF認証が必要なページのパス一覧
export const LIFF_AUTH_REQUIRED_PATHS = [
  // ユーザー関連ページ
  "/users",
  "/wallets", 
  "/tickets",
  
  // 予約関連ページ
  "/reservation",
  
  // 管理画面
  "/admin",
  
  // その他の認証が必要なページ
  "/login",
  "/sign-up",
];

// 認証が不要なページのパス一覧（オプション）
export const LIFF_AUTH_EXCLUDED_PATHS = [
  // 公開ページ
  "/",
  "/activities",
  "/places", 
  "/search",
  "/articles",
  "/privacy",
  "/terms",
];

// パスチェック結果のキャッシュ
const pathCache = new Map<string, boolean>();

/**
 * 現在のパスが認証を必要とするかどうかを判定（メモ化版）
 * @param pathname 現在のパス
 * @returns 認証が必要な場合はtrue
 */
export const isAuthRequiredForPath = (pathname: string): boolean => {
  // キャッシュチェック
  if (pathCache.has(pathname)) {
    return pathCache.get(pathname)!;
  }

  // 除外パスのチェック（より効率的な実装）
  const isExcluded = LIFF_AUTH_EXCLUDED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (isExcluded) {
    pathCache.set(pathname, false);
    return false;
  }
  
  // 認証が必要なパスのチェック
  const isRequired = LIFF_AUTH_REQUIRED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // 結果をキャッシュ
  pathCache.set(pathname, isRequired);
  return isRequired;
};

/**
 * パスキャッシュをクリア（開発時や設定変更時に使用）
 */
export const clearPathCache = (): void => {
  pathCache.clear();
};

/**
 * 環境変数から認証設定を取得
 * @returns 認証設定
 */
export const getAuthConfig = () => {
  // 環境変数で認証が必要なパスをカスタマイズ可能
  const customAuthPaths = process.env.NEXT_PUBLIC_LIFF_AUTH_PATHS;
  
  if (customAuthPaths) {
    try {
      const parsedPaths = JSON.parse(customAuthPaths) as string[];
      // 設定変更時はキャッシュをクリア
      clearPathCache();
      return parsedPaths;
    } catch (error) {
      console.warn("Invalid LIFF_AUTH_PATHS environment variable:", error);
    }
  }
  
  return LIFF_AUTH_REQUIRED_PATHS;
};
