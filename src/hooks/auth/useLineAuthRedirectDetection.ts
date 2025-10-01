"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { useAuthStore } from "@/hooks/auth/auth-store";

interface UseLineAuthRedirectDetectionProps {
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({
  liffService,
}: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);

  const authState = useAuthStore((s) => s.state);

  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(
    null,
  );
  const prevLiffStateRef = useRef<{ isInitialized: boolean; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    const currentState = {
      authenticationState: authState.authenticationState,
      isAuthenticating: authState.isAuthenticating,
    };

    const currentLiffState = liffService.getState();
    const liffStateKey = {
      isInitialized: currentLiffState.isInitialized,
      isLoggedIn: currentLiffState.isLoggedIn,
    };

    const stateChanged =
      !prevStateRef.current ||
      prevStateRef.current.authenticationState !== currentState.authenticationState ||
      prevStateRef.current.isAuthenticating !== currentState.isAuthenticating;

    const liffStateChanged =
      !prevLiffStateRef.current ||
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

    if (authState.isAuthenticating) {
      setShouldProcessRedirect(false);
      return;
    }

    if (
      authState.authenticationState !== "unauthenticated" &&
      authState.authenticationState !== "loading"
    ) {
      setShouldProcessRedirect(false);
      return;
    }

    const { isInitialized, isLoggedIn } = currentLiffState;

    if (isInitialized && !isLoggedIn) {
      setShouldProcessRedirect(false);
      return;
    }

    setShouldProcessRedirect(true);
  }, [authState.authenticationState, authState.isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
