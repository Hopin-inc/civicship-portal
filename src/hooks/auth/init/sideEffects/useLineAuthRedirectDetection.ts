"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";

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

  // --- 共通ログ関数 ---
  const log = (step: string, data?: Record<string, any>) => {
    const entry = {
      ts: new Date().toISOString(),
      step,
      ...data,
    };
    console.log("[REDIRECT DETECTION]", entry);
    try {
      const existing = JSON.parse(localStorage.getItem("redirect-detect-debug") || "[]");
      existing.push(entry);
      localStorage.setItem("redirect-detect-debug", JSON.stringify(existing.slice(-200)));
    } catch {}
  };

  useEffect(() => {
    const currentState = {
      authenticationState,
      isAuthenticating,
    };

    const currentLiffState = liffService.getState();
    const liffStateKey = {
      isInitialized: currentLiffState.isInitialized,
      isLoggedIn: currentLiffState.isLoggedIn,
    };

    log("🔄 Effect run", {
      authenticationState: currentState.authenticationState,
      isAuthenticating: currentState.isAuthenticating,
      isInitialized: liffStateKey.isInitialized,
      isLoggedIn: liffStateKey.isLoggedIn,
    });

    const stateChanged =
      !prevStateRef.current ||
      prevStateRef.current.authenticationState !== currentState.authenticationState ||
      prevStateRef.current.isAuthenticating !== currentState.isAuthenticating;

    const liffStateChanged =
      !prevLiffStateRef.current ||
      prevLiffStateRef.current.isInitialized !== liffStateKey.isInitialized ||
      prevLiffStateRef.current.isLoggedIn !== liffStateKey.isLoggedIn;

    if (!stateChanged && !liffStateChanged) {
      log("⏸ No state change detected → skip");
      return;
    }

    prevStateRef.current = currentState;
    prevLiffStateRef.current = liffStateKey;

    if (typeof window === "undefined") {
      log("🌐 SSR environment → skip");
      setShouldProcessRedirect(false);
      return;
    }

    if (isAuthenticating) {
      log("⏳ Still authenticating → skip");
      setShouldProcessRedirect(false);
      return;
    }

    if (authenticationState !== "unauthenticated" && authenticationState !== "loading") {
      log("🚫 Auth state not unauthenticated/loading → skip", {
        authenticationState: authenticationState,
      });
      setShouldProcessRedirect(false);
      return;
    }

    const { isInitialized, isLoggedIn } = currentLiffState;

    if (isInitialized && !isLoggedIn) {
      log("🚫 LIFF initialized but not logged in → skip");
      setShouldProcessRedirect(false);
      return;
    }

    log("✅ Conditions met → shouldProcessRedirect = true");
    setShouldProcessRedirect(true);
  }, [authenticationState, isAuthenticating]);

  useEffect(() => {
    log("📡 shouldProcessRedirect changed", { shouldProcessRedirect });
  }, [shouldProcessRedirect]);

  return { shouldProcessRedirect };
};
