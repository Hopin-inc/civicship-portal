"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/types/auth";
import { logger } from "@/lib/logging";

interface UseLineAuthRedirectDetectionProps {
  state: AuthState;
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({
  state,
  liffService,
}: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(
    null,
  );
  const prevLiffStateRef = useRef<{ state: string; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    const currentState = {
      authenticationState: state.authenticationState,
      isAuthenticating: state.isAuthenticating,
    };

    const currentLiffState = liffService.getState();
    const liffStateKey = {
      state: currentLiffState.state,
      isLoggedIn: currentLiffState.isLoggedIn,
    };

    const stateChanged =
      !prevStateRef.current ||
      prevStateRef.current.authenticationState !== currentState.authenticationState ||
      prevStateRef.current.isAuthenticating !== currentState.isAuthenticating;

    const liffStateChanged =
      !prevLiffStateRef.current ||
      prevLiffStateRef.current.state !== liffStateKey.state ||
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

    const { state: liffState, isLoggedIn } = currentLiffState;

    if (liffState !== "pre-initialized" && liffState !== "initialized") {
      logger.debug("useLineAuthRedirectDetection: Blocking redirect - LIFF not ready", {
        component: "useLineAuthRedirectDetection",
        liffState,
        authState: state.authenticationState,
      });
      setShouldProcessRedirect(false);
      return;
    }

    if (liffState === "pre-initialized" || liffState === "initialized") {
      if (!isLoggedIn) {
        setShouldProcessRedirect(false);
        return;
      }
    }

    setShouldProcessRedirect(true);
  }, [state.authenticationState, state.isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
