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

      try {
        await liffService.initialize();
      } catch (error) {
        logger.warn("LIFF initialization failed", {
          authType: "liff",
          component: "useLiffInitialization",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
