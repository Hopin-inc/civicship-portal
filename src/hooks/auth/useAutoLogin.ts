"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { toAuthEnvironment } from "@/lib/auth/environment-helpers";
import { AuthState } from "@/contexts/AuthProvider";
import clientLogger from "@/lib/logging/client";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

interface UseAutoLoginProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useAutoLogin = ({ environment, state, liffService, setState, refetchUser }: UseAutoLoginProps) => {
  const attemptedRef = useRef(false);
  const prevStateRef = useRef<{ authenticationState: string; isAuthenticating: boolean } | null>(null);
  const prevLiffStateRef = useRef<{ isInitialized: boolean; isLoggedIn: boolean } | null>(null);

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF) {
      return;
    }

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

    if (stateChanged || liffStateChanged) {
      prevStateRef.current = currentState;
      prevLiffStateRef.current = liffStateKey;

      if (
        state.authenticationState === "unauthenticated" &&
        !state.isAuthenticating &&
        !attemptedRef.current &&
        currentLiffState.isInitialized &&
        currentLiffState.isLoggedIn
      ) {
        const handleAutoLogin = async () => {
          attemptedRef.current = true;

          const timestamp = new Date().toISOString();

          setState((prev) => ({ ...prev, isAuthenticating: true }));
          try {
            const success = await liffService.signInWithLiffToken();
            if (success) {
              await refetchUser();
            }
          } catch (error) {
            clientLogger.info("Auto-login with LIFF failed", createAuthLogContext(
              generateSessionId(),
              toAuthEnvironment("liff"),
              {
                error: error instanceof Error ? error.message : String(error),
                component: "useAutoLogin"
              }
            ));
          } finally {
            setState((prev) => ({ ...prev, isAuthenticating: false }));
          }
        };

        handleAutoLogin();
      }
    }
  }, [environment, state.authenticationState, state.isAuthenticating, liffService, setState, refetchUser]);

  useEffect(() => {
    if (state.authenticationState !== "unauthenticated") {
      attemptedRef.current = false;
    }
  }, [state.authenticationState]);
};
