"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useLineAuthProcessing = ({ shouldProcessRedirect, liffService, setState, refetchUser }: UseLineAuthProcessingProps) => {
  useEffect(() => {
    if (!shouldProcessRedirect) return;

    const handleLineAuthRedirect = async () => {
      setState((prev) => ({ ...prev, isAuthenticating: true }));

      try {
        const initialized = await liffService.initialize();
        if (!initialized) {
          console.error("LIFF init failed");
          return;
        }

        const { isLoggedIn, profile } = liffService.getState();
        console.log("LIFF State:", {
          isInitialized: true,
          isLoggedIn,
          userId: profile?.userId || "none",
        });

        if (!isLoggedIn) {
          console.log("User not logged in via LIFF");
          return;
        }

        const success = await liffService.signInWithLiffToken();
        if (!success) {
          console.error("signInWithLiffToken failed");
          return;
        }

        console.log("LINE auth successful. Refetching user...");
        await refetchUser();
      } catch (err) {
        console.error("Error during LINE auth:", err);
      } finally {
        setState((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect, liffService, setState, refetchUser]);
};
