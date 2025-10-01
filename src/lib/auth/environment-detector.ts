"use client";

/**
 * 認証環境の種類を表す列挙型
 */
export enum AuthEnvironment {
  LIFF_IN_CLIENT = "liff_in_client",   // LINEアプリ内 WebView
  LIFF_WITH_SDK = "liff_with_sdk",     // SDKはあるが in-client ではない（外部ブラウザ）
  WEB = "web",                         // SDKなしのふつうのWeb
}

/**
 * 現在の実行環境を検出する（機能検出ベース）
 * @returns 検出された環境タイプ
 */
export const detectEnvironment = (): AuthEnvironment => {
  if (typeof window === "undefined") return AuthEnvironment.WEB; // SSR安全

  const w = window as any;
  const liff = w?.liff;

  if (liff) {
    try {
      if (typeof liff.isInClient === "function" && liff.isInClient()) {
        return AuthEnvironment.LIFF_IN_CLIENT;
      }
      return AuthEnvironment.LIFF_WITH_SDK;
    } catch {
      return AuthEnvironment.LIFF_WITH_SDK;
    }
  }

  return AuthEnvironment.WEB;
};

/**
 * 現在の環境がLIFF内かどうかを確認
 * @returns LIFF内で実行されている場合はtrue
 */
export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF_IN_CLIENT;
};
