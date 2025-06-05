"use client";

import { useEffect, useState, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";
import clientLogger from "@/lib/logging/client";

interface UseLineAuthRedirectDetectionProps {
  state: AuthState;
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({ state, liffService }: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(null);
  const prevLiffStateRef = useRef<{ isInitialized: boolean; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    const currentState = {
      authenticationState: state.authenticationState,
      isAuthenticating: state.isAuthenticating
    };

    const currentLiffState = liffService.getState();
    const liffStateKey = { isInitialized: currentLiffState.isInitialized, isLoggedIn: currentLiffState.isLoggedIn };

    const stateChanged = !prevStateRef.current ||
      prevStateRef.current.authenticationState !== currentState.authenticationState ||
      prevStateRef.current.isAuthenticating !== currentState.isAuthenticating;

    const liffStateChanged = !prevLiffStateRef.current ||
      prevLiffStateRef.current.isInitialized !== liffStateKey.isInitialized ||
      prevLiffStateRef.current.isLoggedIn !== liffStateKey.isLoggedIn;

    if (!stateChanged && !liffStateChanged) {
      return;
    }

    prevStateRef.current = currentState;
    prevLiffStateRef.current = liffStateKey;

    if (typeof window === "undefined") {
      setShouldProcessRedirect(false);
      return;
    }

    if (state.isAuthenticating) {
      setShouldProcessRedirect(false);
      return;
    }

    if (
      state.authenticationState !== "unauthenticated" &&
      state.authenticationState !== "loading"
    ) {
      setShouldProcessRedirect(false);
      return;
    }

    const { isInitialized, isLoggedIn } = currentLiffState;

    if (isInitialized && !isLoggedIn) {
      clientLogger.debug("LIFF initialized but user not logged in - skipping redirect logic", { component: "useLineAuthRedirectDetection" });
      setShouldProcessRedirect(false);
      return;
    }

    const timestamp = new Date().toISOString();
    clientLogger.debug("Detected LINE authentication redirect", {
      timestamp,
      component: "useLineAuthRedirectDetection"
    });

    setShouldProcessRedirect(true);
  }, [state.authenticationState, state.isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
