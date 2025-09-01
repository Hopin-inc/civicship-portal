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
}

export const useLineAuthProcessing = ({ shouldProcessRedirect, liffService, setState, refetchUser }: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);

  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));

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

        // LIFFサインインとユーザーリフェッチを並列実行
        const signInPromise = liffServiceRef.current.signInWithLiffToken();
        
        // サインインが完了したらユーザーリフェッチを開始
        const success = await signInPromise;

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
          component: "useLineAuthProcessing",
          timestamp: new Date().toISOString(),
        });
      } finally {
        setStateRef.current((prev) => ({ ...prev, isAuthenticating: false }));
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
