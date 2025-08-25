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

/**
 * 現在のパスが認証を必要とするかどうかを判定
 * @param pathname 現在のパス
 * @returns 認証が必要な場合はtrue
 */
export const isAuthRequiredForPath = (pathname: string): boolean => {
  // 除外パスのチェック
  const isExcluded = LIFF_AUTH_EXCLUDED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (isExcluded) {
    return false;
  }
  
  // 認証が必要なパスのチェック
  return LIFF_AUTH_REQUIRED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
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
      return JSON.parse(customAuthPaths) as string[];
    } catch (error) {
      console.warn("Invalid LIFF_AUTH_PATHS environment variable:", error);
    }
  }
  
  return LIFF_AUTH_REQUIRED_PATHS;
};
