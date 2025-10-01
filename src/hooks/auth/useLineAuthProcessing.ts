"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { logger } from "@/lib/logging";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  refetchUser: () => Promise<any>;
}

export const useLineAuthProcessing = ({
  shouldProcessRedirect,
  liffService,
  refetchUser,
}: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);

  const setState = useAuthStore((s) => s.setState);

  useEffect(() => {
    if (!shouldProcessRedirect || processedRef.current) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setState({ isAuthenticating: true });

      try {
        const initialized = await liffService.initialize();
        if (!initialized) {
          logger.info("LIFF init failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        const { isLoggedIn } = liffService.getState();
        if (!isLoggedIn) return;

        const success = await liffService.signInWithLiffToken();
        if (!success) {
          logger.info("signInWithLiffToken failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        await refetchUser();
      } catch (err) {
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing",
        });
      } finally {
        setState({ isAuthenticating: false });
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect, liffService, refetchUser, setState]);

  useEffect(() => {
    if (!shouldProcessRedirect) {
      processedRef.current = false;
    }
  }, [shouldProcessRedirect]);
};
