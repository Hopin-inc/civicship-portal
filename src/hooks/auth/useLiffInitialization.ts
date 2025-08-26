"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";
import { useAuthPathCheck } from "./useAuthPathCheck";

interface UseLiffInitializationProps {
  environment: AuthEnvironment;
  liffService: LiffService;
  // 特定のページでのみ認証を実行するための設定
  authRequiredPaths?: string[];
}

export const useLiffInitialization = ({ 
  environment, 
  liffService, 
  authRequiredPaths = [] 
}: UseLiffInitializationProps) => {
  const { isAuthRequired, pathname } = useAuthPathCheck(authRequiredPaths);

  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      // 認証が不要なページの場合は早期リターン
      if (!isAuthRequired) {
        logger.debug("LIFF auth not required for current path", {
          pathname,
          authRequiredPaths,
          component: "useLiffInitialization",
        });
        return;
      }

      const timestamp = new Date().toISOString();

      const liffSuccess = await liffService.initialize();
      if (!liffSuccess) {
        logger.warn("LIFF initialization failed", {
          authType: "liff",
          timestamp,
          component: "useLiffInitialization",
        });
      }
    };

    initializeLiff();
  }, [environment, liffService, isAuthRequired, pathname, authRequiredPaths]);
};
