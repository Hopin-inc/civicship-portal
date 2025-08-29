"use client";

/**
 * 認証環境の種類を表す列挙型
 */
export enum AuthEnvironment {
  LIFF = "liff",
  LINE_BROWSER = "line_browser",
  REGULAR_BROWSER = "regular_browser",
}

/**
 * 現在の実行環境を検出する
 * @returns 検出された環境タイプ
 */
export const detectEnvironment = (): AuthEnvironment => {
  if (typeof window !== "undefined") {
    const url = window.location.href;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    const hasLiffState = searchParams.has("liff.state");
    const hasAccessToken = hashParams.has("access_token");
    const hasContextToken = hashParams.has("context_token");
    const hasLiffClientId = searchParams.has("liffClientId");
    
    if (hasLiffState || (hasAccessToken && hasContextToken) || hasLiffClientId) {
      return AuthEnvironment.LIFF;
    }
    
    if (window.liff && window.liff.isInClient()) {
      return AuthEnvironment.LIFF;
    }
  }

  if (typeof navigator !== "undefined" && /Line/i.test(navigator.userAgent)) {
    return AuthEnvironment.LINE_BROWSER;
  }

  return AuthEnvironment.REGULAR_BROWSER;
};

/**
 * 現在の環境がLIFF内かどうかを確認
 * @returns LIFF内で実行されている場合はtrue
 */
export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF;
};
