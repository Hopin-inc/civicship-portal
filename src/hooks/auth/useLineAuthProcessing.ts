"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

import { AuthEnvironment } from "@/lib/auth/environment-detector";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
  setIsProcessingAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useLineAuthProcessing = ({ shouldProcessRedirect, liffService, setState, refetchUser, setIsProcessingAuth }: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);
  const setIsProcessingAuthRef = useRef(setIsProcessingAuth);

  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;
  setIsProcessingAuthRef.current = setIsProcessingAuth;

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
