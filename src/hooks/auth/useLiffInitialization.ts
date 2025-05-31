"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import clientLogger from "@/lib/logging/client";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

export const useLiffInitialization = ({ environment, liffService }: UseLiffInitializationProps) => {
  useEffect(() => {
    clientLogger.debug("useLiffInitialization fired", { component: "useLiffInitialization" });
    
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      const timestamp = new Date().toISOString();
      clientLogger.debug("Initializing LIFF in environment", { 
        timestamp, 
        environment, 
        component: "useLiffInitialization" 
      });

      const liffSuccess = await liffService.initialize();
      if (liffSuccess) {
        const liffState = liffService.getState();
        clientLogger.debug("LIFF state after initialization", {
          timestamp,
          isInitialized: liffState.isInitialized,
          isLoggedIn: liffState.isLoggedIn,
          userId: liffState.profile?.userId || "none",
          component: "useLiffInitialization"
        });
      } else {
        clientLogger.info("LIFF initialization failed", createAuthLogContext(
          generateSessionId(),
          "liff",
          { timestamp, component: "useLiffInitialization" }
        ));
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
