"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";

import { AuthEnvironment } from "@/lib/auth/environment-detector";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
  setIsProcessingAuth: React.Dispatch<React.SetStateAction<boolean>>;
  authStateManager: AuthStateManager | null;
}

export const useLineAuthProcessing = ({ shouldProcessRedirect, liffService, setState, refetchUser, setIsProcessingAuth, authStateManager }: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);
  const setIsProcessingAuthRef = useRef(setIsProcessingAuth);
  const authStateManagerRef = useRef(authStateManager);

  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;
  setIsProcessingAuthRef.current = setIsProcessingAuth;
  authStateManagerRef.current = authStateManager;

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));
      setIsProcessingAuthRef.current(true);

      try {
        const initialized = await liffServiceRef.current.initialize();
        if (!initialized) {
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing"
          });
          return;
        }

        const { isLoggedIn, profile } = liffServiceRef.current.getState();

        if (!isLoggedIn) {
          return;
        }

        const success = await liffServiceRef.current.signInWithLiffToken();
        if (!success) {
          logger.info("signInWithLiffToken failed", {
            authType: "liff",
            component: "useLineAuthProcessing"
          });
          return;
        }

        await refetchUserRef.current();
        
        const currentAuthStateManager = authStateManagerRef.current;
        if (currentAuthStateManager && currentAuthStateManager.getState() === "loading") {
          logger.debug("Updating AuthStateManager state after successful LIFF auth", {
            component: "useLineAuthProcessing"
          });
          await currentAuthStateManager.handleLineAuthStateChange(true);
        }
      } catch (err) {
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing"
        });
      } finally {
        setStateRef.current((prev) => ({ ...prev, isAuthenticating: false }));
        setIsProcessingAuthRef.current(false);
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect]);

  useEffect(() => {
    if (!shouldProcessRedirect) {
      processedRef.current = false;
    }
  }, [shouldProcessRedirect]);
};
