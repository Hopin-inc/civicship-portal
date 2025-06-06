"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { toAuthEnvironment } from "@/lib/auth/environment-helpers";
import { TokenManager } from "@/lib/auth/token-manager";
import clientLogger from "@/lib/logging/client";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

export const useLiffInitialization = ({ environment, liffService }: UseLiffInitializationProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      const timestamp = new Date().toISOString();

      const liffSuccess = await liffService.initialize();
      if (!liffSuccess) {
        clientLogger.warn("LIFF initialization failed", createAuthLogContext(
          generateSessionId(),
          toAuthEnvironment("liff"),
          { timestamp, component: "useLiffInitialization" }
        ));
      }
    };

    initializeLiff();
  }, [environment, liffService]);
};
