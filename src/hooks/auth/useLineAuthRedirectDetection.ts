"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { useAuthStore } from "@/hooks/auth/auth-store";

interface UseLineAuthRedirectDetectionProps {
  liffService: LiffService;
}

/**
 * LIFF認証リダイレクトを実行すべきかを判定するカスタムフック
 *
 * 条件:
 * - 認証状態が unauthenticated または loading
 * - LIFFが初期化済みかつログイン済み
 */
export const useLineAuthRedirectDetection = ({
  liffService,
}: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const authState = useAuthStore((s) => s.state);

  const prevAuthRef = useRef(authState);
  const prevLiffRef = useRef(liffService.getState());

  /** 状態変化の検出 */
  const hasStateChanged = (prev: typeof authState, current: typeof authState): boolean =>
    prev.authenticationState !== current.authenticationState ||
    prev.isAuthenticating !== current.isAuthenticating;

  const hasLiffStateChanged = (
    prev: ReturnType<LiffService["getState"]>,
    current: ReturnType<LiffService["getState"]>,
  ): boolean =>
    prev.isInitialized !== current.isInitialized || prev.isLoggedIn !== current.isLoggedIn;

  useEffect(() => {
    const currentLiff = liffService.getState();
    const authChanged = hasStateChanged(prevAuthRef.current, authState);
    const liffChanged = hasLiffStateChanged(prevLiffRef.current, currentLiff);

    if (!authChanged && !liffChanged) return;

    prevAuthRef.current = authState;
    prevLiffRef.current = currentLiff;

    // SSR環境では無効
    if (typeof window === "undefined") return setShouldProcessRedirect(false);

    // 認証処理中ならスキップ
    if (authState.isAuthenticating) return setShouldProcessRedirect(false);

    // 既に認証済みならスキップ
    if (!["unauthenticated", "loading"].includes(authState.authenticationState))
      return setShouldProcessRedirect(false);

    // LIFF未初期化 or 未ログインならスキップ
    if (!currentLiff.isInitialized || !currentLiff.isLoggedIn)
      return setShouldProcessRedirect(false);

    // 上記すべてを満たす場合のみ true
    setShouldProcessRedirect(true);
  }, [authState.authenticationState, authState.isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
