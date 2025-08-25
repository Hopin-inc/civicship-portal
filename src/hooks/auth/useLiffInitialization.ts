"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { isAuthRequiredForPath } from "@/config/auth-config";
import { logger } from "@/lib/logging";

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
  const pathname = usePathname();

  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      // 特定のページでのみ認証を実行する場合の条件チェック
      if (authRequiredPaths.length > 0) {
        // isAuthRequiredForPath関数を使用
        if (!isAuthRequiredForPath(pathname)) {
          logger.debug("LIFF auth not required for current path", {
            pathname,
            authRequiredPaths,
            component: "useLiffInitialization",
          });
          return;
        }
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
  }, [environment, liffService, pathname, authRequiredPaths]);
};
