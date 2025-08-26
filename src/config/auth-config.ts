import { logger } from "@/lib/logging";

/**
 * 認証設定
 * 特定のページでのみLIFF認証を実行するための設定
 */

// キャッシュ設定
const AUTH_CACHE_CONFIG = {
  // キャッシュサイズ: 実際のアプリケーションのパス数に基づく
  // 静的パス(~30) + 動的ルートパターン(~15) + 予備(~15) = 60
  MAX_CACHE_SIZE: 60,
  
  // 開発環境ではより小さいサイズでテスト
  DEV_MAX_CACHE_SIZE: 30,
} as const;

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
 * パスを正規化する関数
 * 動的ルートのID部分を正規化してキャッシュ効率を向上
 * @param pathname 元のパス
 * @returns 正規化されたパス
 */
const normalizePath = (pathname: string): string => {
  // 動的ルートのパターンを定義
  const dynamicPatterns = [
    /^\/users\/[^\/]+$/, // /users/123 → /users/:id
    /^\/activities\/[^\/]+$/, // /activities/456 → /activities/:id
    /^\/places\/[^\/]+$/, // /places/789 → /places/:id
    /^\/tickets\/[^\/]+$/, // /tickets/abc → /tickets/:id
    /^\/wallets\/[^\/]+$/, // /wallets/def → /wallets/:id
  ];

  // 動的パターンにマッチする場合は正規化
  for (const pattern of dynamicPatterns) {
    if (pattern.test(pathname)) {
      return pathname.replace(/\/[^\/]+$/, '/:id');
    }
  }

  return pathname;
};

/**
 * LRUキャッシュの実装
 * 動的ルートでのメモリリークを防ぐため、サイズ制限付きキャッシュ
 */
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number = AUTH_CACHE_CONFIG.MAX_CACHE_SIZE) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // アクセスされた要素を最新に移動
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // 既存のキーの場合は削除してから再追加
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // キャパシティに達した場合、最も古い要素を削除
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getCapacity(): number {
    return this.capacity;
  }
}

// 環境に応じたキャッシュサイズを決定
const getCacheSize = (): number => {
  if (process.env.NODE_ENV === 'development') {
    return AUTH_CACHE_CONFIG.DEV_MAX_CACHE_SIZE;
  }
  return AUTH_CACHE_CONFIG.MAX_CACHE_SIZE;
};

// パスチェック結果のLRUキャッシュ
const pathCache = new LRUCache<string, boolean>(getCacheSize());

/**
 * 現在のパスが認証を必要とするかどうかを判定（メモ化版）
 * @param pathname 現在のパス
 * @returns 認証が必要な場合はtrue
 */
export const isAuthRequiredForPath = (pathname: string): boolean => {
  // パスを正規化
  const normalizedPath = normalizePath(pathname);
  
  // キャッシュチェック
  if (pathCache.has(normalizedPath)) {
    return pathCache.get(normalizedPath)!;
  }

  // 除外パスのチェック（より効率的な実装）
  const isExcluded = LIFF_AUTH_EXCLUDED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (isExcluded) {
    pathCache.set(normalizedPath, false);
    return false;
  }
  
  // 認証が必要なパスのチェック
  const isRequired = LIFF_AUTH_REQUIRED_PATHS.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // 結果をキャッシュ
  pathCache.set(normalizedPath, isRequired);
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
      logger.warn("Invalid LIFF_AUTH_PATHS environment variable", {
        error: error instanceof Error ? error.message : String(error),
        component: "auth-config",
        errorCategory: "configuration_error",
      });
    }
  }
  
  return LIFF_AUTH_REQUIRED_PATHS;
};
