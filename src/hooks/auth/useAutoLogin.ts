"use client";

import React, { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { AuthState } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

interface UseAutoLoginProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

const useAutoLogin = ({
  environment,
  state,
  liffService,
  setState,
  refetchUser,
}: UseAutoLoginProps) => {
  const attemptedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const refetchUserRef = useRef(refetchUser);

  useEffect(() => { liffServiceRef.current = liffService; }, [liffService]);
  useEffect(() => { refetchUserRef.current = refetchUser; }, [refetchUser]);

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF) {
      return;
    }

    if (
      state.authenticationState === "unauthenticated" &&
      !state.isAuthenticating &&
      !attemptedRef.current
    ) {
      const currentLiffState = liffServiceRef.current.getState();
      if (
        (currentLiffState.state === "initialized" || currentLiffState.state === "pre-initialized") &&
        currentLiffState.isLoggedIn
      ) {
        const handleAutoLogin = async () => {
          attemptedRef.current = true;

          setState((prev) => ({ ...prev, isAuthenticating: true }));
          try {
            const success = await liffServiceRef.current.signInWithLiffToken();
            if (success) {
              await refetchUserRef.current();
            }
          } catch (error) {
            logger.info("Auto-login with LIFF failed", {
              authType: "liff",
              error: error instanceof Error ? error.message : String(error),
              component: "useAutoLogin",
            });
          } finally {
            setState((prev) => ({ ...prev, isAuthenticating: false }));
          }
        };

        handleAutoLogin();
      }
    }

    if (state.authenticationState !== "unauthenticated") {
      attemptedRef.current = false;
    }
  }, [environment, state.authenticationState, state.isAuthenticating]);
};

export default useAutoLogin;
