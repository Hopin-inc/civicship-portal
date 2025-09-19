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
    let cancelled = false;

    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      const timestamp = new Date().toISOString();

      const liffSuccess = await liffService.initialize();
      if (!liffSuccess && !cancelled) {
        logger.warn("LIFF initialization failed", {
          authType: "liff",
          timestamp,
          component: "useLiffInitialization",
        });
      }
    };

    initializeLiff();

    return () => {
      cancelled = true;
    };
  }, [environment, liffService]);
};
