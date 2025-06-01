"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";
import clientLogger from "@/lib/logging/client";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

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
          clientLogger.info("LIFF init failed", createAuthLogContext(
            generateSessionId(),
            "liff",
            { component: "useLineAuthProcessing" }
          ));
          return;
        }

        const { isLoggedIn, profile } = liffServiceRef.current.getState();
        clientLogger.debug("LIFF State", {
          isInitialized: true,
          isLoggedIn,
          userId: profile?.userId || "none",
          component: "useLineAuthProcessing"
        });

        if (!isLoggedIn) {
          clientLogger.debug("User not logged in via LIFF", {
            component: "useLineAuthProcessing"
          });
          return;
        }

        const success = await liffServiceRef.current.signInWithLiffToken();
        if (!success) {
          clientLogger.info("signInWithLiffToken failed", createAuthLogContext(
            generateSessionId(),
            "liff",
            { component: "useLineAuthProcessing" }
          ));
          return;
        }

        clientLogger.debug("LINE auth successful. Refetching user", {
          component: "useLineAuthProcessing"
        });
        await refetchUserRef.current();
      } catch (err) {
        clientLogger.info("Error during LINE auth", createAuthLogContext(
          generateSessionId(),
          "liff",
          {
            error: err instanceof Error ? err.message : String(err),
            component: "useLineAuthProcessing"
          }
        ));
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
