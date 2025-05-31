"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

export const useLiffInitialization = ({ environment, liffService }: UseLiffInitializationProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Initializing LIFF in environment:`, environment);

      const liffSuccess = await liffService.initialize();
      if (liffSuccess) {
        const liffState = liffService.getState();
        console.log(`🔍 [${timestamp}] LIFF state after initialization:`, {
          isInitialized: liffState.isInitialized,
          isLoggedIn: liffState.isLoggedIn,
          userId: liffState.profile?.userId || "none",
        });
      } else {
        console.error(`🔍 [${timestamp}] LIFF initialization failed`);
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
