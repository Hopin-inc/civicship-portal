"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/types/auth";
import { logger } from "@/lib/logging";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
  enabled?: boolean;
}

export const useLineAuthProcessing = ({
  shouldProcessRedirect,
  liffService,
  setState,
  refetchUser,
  enabled = true,
}: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);

  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;

  useEffect(() => {
    if (!enabled || !shouldProcessRedirect || processedRef.current) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));

      try {
        await liffServiceRef.current.initialize();

        const { isLoggedIn, profile } = liffServiceRef.current.getState();

        if (!isLoggedIn) {
          return;
        }

        if (!profile) {
          logger.info("No profile found", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        const success = await liffServiceRef.current.signInWithLiffToken();
        if (!success) {
          logger.info("LIFF sign in failed", {
            authType: "liff",
            component: "useLineAuthProcessing",
          });
          return;
        }

        await refetchUserRef.current();
      } catch (err) {
        logger.info("Error during LINE auth", {
          authType: "liff",
          error: err instanceof Error ? err.message : String(err),
          component: "useLineAuthProcessing",
        });
      } finally {
        setStateRef.current((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect, enabled]);

  useEffect(() => {
    if (!shouldProcessRedirect) {
      processedRef.current = false;
    }
  }, [shouldProcessRedirect]);
};
