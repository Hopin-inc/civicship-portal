"use client";

import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";

/**
 * LIFF環境判定を提供するフック
 * auth-storeのenvironmentを単一の真実の源として使用
 *
 * @returns {Object} 環境判定結果
 * - environment: AuthEnvironment enum値
 * - isLiffClient: LIFFアプリ内のみ（SwipeBackNavigation等）
 * - isLineBrowser: LINEブラウザのみ（phone-verification等）
 * - isInLine: LIFF + LINEブラウザ両方（Header戻るボタン非表示、BottomBarパディング等）
 */
export const useAuthEnvironment = () => {
  const environment = useAuthStore((s) => s.state.environment);

  return {
    environment,
    isLiffClient: environment === AuthEnvironment.LIFF,
    isLineBrowser: environment === AuthEnvironment.LINE_BROWSER,
    isInLine: environment === AuthEnvironment.LIFF || environment === AuthEnvironment.LINE_BROWSER,
  };
};

/**
 * 非Reactコード用のヘルパー関数
 * Zustandストアから直接環境を取得
 */
export const getAuthEnvironment = () => {
  return useAuthStore.getState().state.environment;
};
