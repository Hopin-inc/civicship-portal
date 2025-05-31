"use client";

import { useEffect, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";

interface UseLineAuthRedirectDetectionProps {
  state: AuthState;
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({ state, liffService }: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);

  useEffect(() => {
    const checkRedirectConditions = () => {
      if (typeof window === "undefined") return false;

      if (state.isAuthenticating) {
        console.log("[Debug] Skipping: already authenticating");
        return false;
      }

      if (
        state.authenticationState !== "unauthenticated" &&
        state.authenticationState !== "loading"
      ) {
        console.log("[Debug] Skipping: already authenticated or in progress");
        return false;
      }

      const { isInitialized, isLoggedIn } = liffService.getState();

      if (isInitialized && !isLoggedIn) {
        console.log("[Debug] LIFF initialized but user not logged in - skipping redirect logic");
        return false;
      }

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Detected LINE authentication redirect`);
      console.log(`🔍 [${timestamp}] Current state:`, {
        authenticationState: state.authenticationState,
        isAuthenticating: state.isAuthenticating,
        windowHref: window.location.href,
      });

      return true;
    };

    setShouldProcessRedirect(checkRedirectConditions());
  }, [state.authenticationState, state.isAuthenticating, liffService]);

  return { shouldProcessRedirect };
};
