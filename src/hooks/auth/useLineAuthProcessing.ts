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
      const startTime = performance.now();
      logger.debug("LINE auth redirect processing started", {
        component: "useLineAuthProcessing",
        timestamp: new Date().toISOString(),
      });

      processedRef.current = true;
      setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));

      try {
        const initStartTime = performance.now();
        const initialized = await liffServiceRef.current.initialize();
        const initEndTime = performance.now();
        
        logger.debug("LIFF initialization in auth processing completed", {
          component: "useLineAuthProcessing",
          duration: `${(initEndTime - initStartTime).toFixed(2)}ms`,
          success: initialized,
          timestamp: new Date().toISOString(),
        });

        if (!initialized) {
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing"
          });
          return;
        }

        const stateCheckStartTime = performance.now();
        const { isLoggedIn, profile } = liffServiceRef.current.getState();
        const stateCheckEndTime = performance.now();
        
        logger.debug("LIFF state check completed", {
          component: "useLineAuthProcessing",
          duration: `${(stateCheckEndTime - stateCheckStartTime).toFixed(2)}ms`,
          isLoggedIn,
          timestamp: new Date().toISOString(),
        });

        if (!isLoggedIn) {
          return;
        }

        const signInStartTime = performance.now();
        const success = await liffServiceRef.current.signInWithLiffToken();
        const signInEndTime = performance.now();
        
        logger.debug("LIFF sign in with token completed", {
          component: "useLineAuthProcessing",
          duration: `${(signInEndTime - signInStartTime).toFixed(2)}ms`,
          success,
          timestamp: new Date().toISOString(),
        });

        if (!success) {
          logger.info("signInWithLiffToken failed", {
            authType: "liff",
            component: "useLineAuthProcessing"
          });
          return;
        }

        const refetchStartTime = performance.now();
        await refetchUserRef.current();
        const refetchEndTime = performance.now();
        
        logger.debug("User refetch completed", {
          component: "useLineAuthProcessing",
          duration: `${(refetchEndTime - refetchStartTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });

        const endTime = performance.now();
        logger.debug("LINE auth redirect processing completed successfully", {
          component: "useLineAuthProcessing",
          totalDuration: `${(endTime - startTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });

      } catch (err) {
        const endTime = performance.now();
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing",
          totalDuration: `${(endTime - startTime).toFixed(2)}ms`,
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
