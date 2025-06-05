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
  if (typeof window !== "undefined" && window.liff && window.liff.isInClient()) {
    return AuthEnvironment.LIFF;
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

/**
 * 現在の環境がLINEブラウザ内かどうかを確認
 * @returns LINEブラウザ内で実行されている場合はtrue
 */
export const isRunningInLineBrowser = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LINE_BROWSER;
};

/**
 * 現在の環境がLIFFまたはLINEブラウザ内かどうかを確認
 * @returns LIFFまたはLINEブラウザ内で実行されている場合はtrue
 */
export const isRunningInLineEnvironment = (): boolean => {
  const env = detectEnvironment();
  return env === AuthEnvironment.LIFF || env === AuthEnvironment.LINE_BROWSER;
};
