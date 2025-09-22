"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";


interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

export const useLiffInitialization = ({ environment, liffService }: UseLiffInitializationProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) {
        logger.debug("useLiffInitialization: Skipping LIFF init (not LIFF environment)", {
          component: "useLiffInitialization",
          timestamp: new Date().toISOString(),
          environment,
        });
        return;
      }

      const timestamp = new Date().toISOString();
      
      logger.debug("useLiffInitialization: Starting LIFF initialization", {
        component: "useLiffInitialization",
        timestamp,
        environment,
        liffState: liffService.getState(),
      });

      const liffSuccess = await liffService.initialize();
      
      logger.debug("useLiffInitialization: LIFF initialization completed", {
        authType: "liff",
        timestamp: new Date().toISOString(),
        component: "useLiffInitialization",
        success: liffSuccess,
        finalLiffState: liffService.getState(),
      });

      if (!liffSuccess) {
        logger.warn("useLiffInitialization: LIFF initialization failed", {
          authType: "liff",
          timestamp: new Date().toISOString(),
          component: "useLiffInitialization",
          liffState: liffService.getState(),
        });
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
