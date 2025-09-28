"use client";

import { useEffect, useRef, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { AuthState } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

interface UseAuthCoordinatorProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useAuthCoordinator = ({
  environment,
  state,
  liffService,
  setState,
  refetchUser,
}: UseAuthCoordinatorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const attemptedAutoLoginRef = useRef(false);
  const processedRedirectRef = useRef(false);

  useEffect(() => {
    if (state.authenticationState === "unauthenticated") {
      attemptedAutoLoginRef.current = false;
      processedRedirectRef.current = false;
    }
  }, [state.authenticationState]);

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF || isProcessing || state.isAuthenticating) {
      return;
    }

    const handleAuthFlow = async () => {
      const liffState = liffService.getState();
      
      if (!liffState.isInitialized || !liffState.isLoggedIn) {
        return;
      }

      const shouldProcessRedirect = 
        (state.authenticationState === "unauthenticated" || state.authenticationState === "loading") &&
        !processedRedirectRef.current;

      if (shouldProcessRedirect) {
        setIsProcessing(true);
        processedRedirectRef.current = true;
        
        try {
          setState((prev) => ({ ...prev, isAuthenticating: true }));
          
          const success = await liffService.signInWithLiffToken();
          if (success) {
            await refetchUser();
          }
        } catch (error) {
          logger.info("LINE auth redirect processing failed", {
            authType: "liff",
            error: error instanceof Error ? error.message : String(error),
            component: "useAuthCoordinator",
          });
        } finally {
          setState((prev) => ({ ...prev, isAuthenticating: false }));
          setIsProcessing(false);
        }
        return;
      }

      const shouldAutoLogin = 
        state.authenticationState === "unauthenticated" &&
        !attemptedAutoLoginRef.current &&
        liffState.isInitialized &&
        liffState.isLoggedIn;

      if (shouldAutoLogin) {
        setIsProcessing(true);
        attemptedAutoLoginRef.current = true;
        
        try {
          setState((prev) => ({ ...prev, isAuthenticating: true }));
          
          const success = await liffService.signInWithLiffToken();
          if (success) {
            await refetchUser();
          }
        } catch (error) {
          logger.info("Auto-login with LIFF failed", {
            authType: "liff",
            error: error instanceof Error ? error.message : String(error),
            component: "useAuthCoordinator",
          });
        } finally {
          setState((prev) => ({ ...prev, isAuthenticating: false }));
          setIsProcessing(false);
        }
      }
    };

    handleAuthFlow();
  }, [
    environment,
    state.authenticationState,
    state.isAuthenticating,
    liffService,
    setState,
    refetchUser,
    isProcessing,
  ]);
};
