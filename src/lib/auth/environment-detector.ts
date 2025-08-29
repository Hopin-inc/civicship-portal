"use client";

/**
 * 認証環境の種類を表す列挙型
 */
export enum AuthEnvironment {
  LIFF = "liff",
  LINE_BROWSER = "line_browser",
  REGULAR_BROWSER = "regular_browser",
}

let cachedEnvironment: AuthEnvironment | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5000; // 5秒間のキャッシュ

/**
 * 環境検出キャッシュをクリア
 * ナビゲーション発生時やURL変更時に呼び出す
 */
export const clearEnvironmentCache = (): void => {
  cachedEnvironment = null;
  cacheTimestamp = 0;
  console.debug("detectEnvironment: キャッシュをクリア");
};

/**
 * 現在の実行環境を検出する
 * @returns 検出された環境タイプ
 */
export const detectEnvironment = (): AuthEnvironment => {
  const now = Date.now();
  if (cachedEnvironment && (now - cacheTimestamp) < CACHE_DURATION) {
    console.debug("detectEnvironment: キャッシュ結果を使用", { 
      cachedEnvironment, 
      age: now - cacheTimestamp 
    });
    return cachedEnvironment;
  }

  let result: AuthEnvironment;

  if (typeof window !== "undefined") {
    const url = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const hasLiffState = searchParams.has("liff.state");
    const hasAccessToken = hashParams.has("access_token");
    const hasContextToken = hashParams.has("context_token");
    const hasLiffClientId = searchParams.has("liffClientId");
    
    const debugInfo = {
      url,
      search: window.location.search,
      hash: window.location.hash,
      hasLiffState,
      hasAccessToken,
      hasContextToken,
      hasLiffClientId,
      hasWindowLiff: !!(window.liff),
      isInClient: !!(window.liff && window.liff.isInClient()),
      userAgent: navigator?.userAgent || 'undefined',
      timestamp: now,
      stackTrace: new Error().stack?.split('\n').slice(0, 5).join('\n') // 最初の5行のみ
    };
    
    if (hasLiffState || (hasAccessToken && hasContextToken) || hasLiffClientId) {
      console.debug("detectEnvironment: URLパラメータでLIFF検出", debugInfo);
      result = AuthEnvironment.LIFF;
    } else if (window.liff && window.liff.isInClient()) {
      console.debug("detectEnvironment: window.liffでLIFF検出", debugInfo);
      result = AuthEnvironment.LIFF;
    } else if (typeof navigator !== "undefined" && /Line/i.test(navigator.userAgent)) {
      console.debug("detectEnvironment: LINE_BROWSER検出", debugInfo);
      result = AuthEnvironment.LINE_BROWSER;
    } else {
      console.debug("detectEnvironment: REGULAR_BROWSER検出", debugInfo);
      result = AuthEnvironment.REGULAR_BROWSER;
    }
  } else {
    console.debug("detectEnvironment: サーバーサイド、REGULAR_BROWSERを返す");
    result = AuthEnvironment.REGULAR_BROWSER;
  }

  cachedEnvironment = result;
  cacheTimestamp = now;
  console.debug("detectEnvironment: 新しい結果をキャッシュ", { 
    result, 
    timestamp: cacheTimestamp 
  });
  
  return result;
};

/**
 * 現在の環境がLIFF内かどうかを確認
 * @returns LIFF内で実行されている場合はtrue
 */
export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF;
};
