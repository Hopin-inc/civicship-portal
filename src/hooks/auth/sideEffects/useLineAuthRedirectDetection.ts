"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";

interface UseLineAuthRedirectDetectionProps {
  liffService: LiffService;
  hasFullAuth: boolean;
}

/**
 * Detects when LIFF redirect handling should begin based on
 * authentication and LIFF state transitions.
 */
export const useLineAuthRedirectDetection = ({
  liffService,
  hasFullAuth,
}: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const authenticationState = useAuthStore((s) => s.state.authenticationState);
  const isAuthenticating = useAuthStore((s) => s.state.isAuthenticating);

  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(
    null,
  );
  const prevLiffStateRef = useRef<{ isInitialized: boolean; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    // 🚫 SSRで full-auth の場合は何もしない
    if (hasFullAuth) return;

    const authState = { authenticationState, isAuthenticating };
    const liffState = liffService.getState();

    // --- 差分検出ロジック ---
    const stateChanged =
      !prevStateRef.current ||
      prevStateRef.current.authenticationState !== authState.authenticationState ||
      prevStateRef.current.isAuthenticating !== authState.isAuthenticating;

    const liffStateChanged =
      !prevLiffStateRef.current ||
      prevLiffStateRef.current.isInitialized !== liffState.isInitialized ||
      prevLiffStateRef.current.isLoggedIn !== liffState.isLoggedIn;

    if (!stateChanged && !liffStateChanged) return;

    prevStateRef.current = authState;
    prevLiffStateRef.current = liffState;

    // --- スキップ条件まとめ ---
    const shouldSkip =
      typeof window === "undefined" || // SSR
      isAuthenticating || // 認証中
      !["unauthenticated", "loading"].includes(authenticationState) || // 認証不要状態
      (liffState.isInitialized && !liffState.isLoggedIn); // LIFF初期化済みだがログイン未実施

    if (shouldSkip) {
      setShouldProcessRedirect(false);
      return;
    }

    setShouldProcessRedirect(true);
  }, [authenticationState, hasFullAuth, isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
