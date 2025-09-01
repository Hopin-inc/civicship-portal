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
      if (environment !== AuthEnvironment.LIFF) return;

      const startTime = performance.now();
      const timestamp = new Date().toISOString();
      
      logger.debug("LIFF initialization started", {
        authType: "liff",
        timestamp,
        component: "useLiffInitialization",
      });

      const liffSuccess = await liffService.initialize();
      const endTime = performance.now();
      
      if (!liffSuccess) {
        logger.warn("LIFF initialization failed", {
          authType: "liff",
          timestamp,
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          component: "useLiffInitialization",
        });
      } else {
        logger.debug("LIFF initialization completed", {
          authType: "liff",
          timestamp,
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          component: "useLiffInitialization",
        });
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
