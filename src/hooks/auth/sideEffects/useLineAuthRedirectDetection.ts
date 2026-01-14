"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";

interface UseLineAuthRedirectDetectionProps {
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({
  liffService,
}: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const authenticationState = useAuthStore((s) => s.state.authenticationState);
  const isAuthenticating = useAuthStore((s) => s.state.isAuthenticating);

  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(
    null,
  );
  const prevLiffStateRef = useRef<{ isInitialized: boolean; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
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

    logger.warn("[DEBUG] useLineAuthRedirectDetection: State changed", {
      authState,
      liffState,
      prevAuthState: prevStateRef.current,
      prevLiffState: prevLiffStateRef.current,
    });

    prevStateRef.current = authState;
    prevLiffStateRef.current = liffState;

    // --- スキップ条件まとめ ---
    const shouldSkip =
      typeof window === "undefined" || // SSR
      isAuthenticating || // 認証中
      !["unauthenticated", "loading"].includes(authenticationState) || // 認証不要状態
      (liffState.isInitialized && !liffState.isLoggedIn); // LIFF初期化済みだがログイン未実施

    logger.warn("[DEBUG] useLineAuthRedirectDetection: Skip evaluation", {
      shouldSkip,
      reasons: {
        isSSR: typeof window === "undefined",
        isAuthenticating,
        authStateNotInList: !["unauthenticated", "loading"].includes(authenticationState),
        liffInitializedButNotLoggedIn: liffState.isInitialized && !liffState.isLoggedIn,
      },
    });

    if (shouldSkip) {
      setShouldProcessRedirect(false);
      return;
    }

    logger.warn("[DEBUG] useLineAuthRedirectDetection: Setting shouldProcessRedirect to TRUE");
    setShouldProcessRedirect(true);
  }, [authenticationState, isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
