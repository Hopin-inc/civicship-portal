"use client";

/**
 * 認証環境の種類を表す列挙型
 */
export enum AuthEnvironment {
  LIFF = "liff",   // LINEアプリ内 WebView
  WEB = "web",     // 通常のWebブラウザ
}

/**
 * 現在の実行環境を検出する（機能検出ベース）
 * @returns 検出された環境タイプ
 */
export const detectEnvironment = (): AuthEnvironment => {
  if (typeof window === "undefined") return AuthEnvironment.WEB; // SSR安全

  const w = window as any;
  const liff = w?.liff;

  if (liff && typeof liff.isInClient === "function") {
    try {
      if (liff.isInClient()) {
        return AuthEnvironment.LIFF;
      }
    } catch {
    }
  }

  return AuthEnvironment.WEB;
};

/**
 * 現在の環境がLIFF内かどうかを確認
 * @returns LIFF内で実行されている場合はtrue
 */
export const isRunningInLiff = (): boolean => {
  return detectEnvironment() === AuthEnvironment.LIFF;
};
