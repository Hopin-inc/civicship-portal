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
const CACHE_DURATION = 1000; // 1秒間のキャッシュ（テスト用に短縮）

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
      searchParamsKeys: Array.from(searchParams.keys()),
      hashParamsKeys: Array.from(hashParams.keys()),
      stackTrace: new Error().stack?.split('\n').slice(0, 3).join('\n') // 最初の3行のみ
    };
    
    const isLiffUserAgent = typeof navigator !== "undefined" && /LIFF/i.test(navigator.userAgent);
    
    const userAgentAnalysis = {
      isLiffUserAgent,
      hasLIFF: navigator?.userAgent?.includes('LIFF') || false,
      hasLine: navigator?.userAgent?.includes('Line') || false,
      liffRegexTest: /LIFF/i.test(navigator?.userAgent || ''),
      lineRegexTest: /Line/i.test(navigator?.userAgent || '')
    };
    
    if (hasLiffState || (hasAccessToken && hasContextToken) || hasLiffClientId) {
      console.debug("detectEnvironment: URLパラメータでLIFF検出", { ...debugInfo, userAgentAnalysis });
      result = AuthEnvironment.LIFF;
    } else if (window.liff && window.liff.isInClient()) {
      console.debug("detectEnvironment: window.liffでLIFF検出", { ...debugInfo, userAgentAnalysis });
      result = AuthEnvironment.LIFF;
    } else if (isLiffUserAgent) {
      console.debug("detectEnvironment: User-AgentでLIFF検出", { ...debugInfo, userAgentAnalysis });
      result = AuthEnvironment.LIFF;
    } else if (typeof navigator !== "undefined" && /Line/i.test(navigator.userAgent)) {
      console.debug("detectEnvironment: LINE_BROWSER検出", { ...debugInfo, userAgentAnalysis });
      result = AuthEnvironment.LINE_BROWSER;
    } else {
      console.debug("detectEnvironment: REGULAR_BROWSER検出", { ...debugInfo, userAgentAnalysis });
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
