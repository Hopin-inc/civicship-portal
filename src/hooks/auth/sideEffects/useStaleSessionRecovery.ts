"use client";

import { useEffect, MutableRefObject } from "react";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { LiffService } from "@/lib/auth/service/liff-service";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { initAuth } from "@/lib/auth/init";
import { logger } from "@/lib/logging";

interface UseStaleSessionRecoveryProps {
  authStateManager: AuthStateManager | null;
  liffService: LiffService;
  communityConfig: CommunityPortalConfig | null;
  hasInitialized: MutableRefObject<boolean>;
}

export const useStaleSessionRecovery = ({
  authStateManager,
  liffService,
  communityConfig,
  hasInitialized,
}: UseStaleSessionRecoveryProps) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let isHandling = false;

    const handleTokenExpired = async (event: Event) => {
      if (isHandling) return;
      isHandling = true;
      try {
        logger.warn("[AuthProvider] Stale session detected — clearing and re-authenticating", {
          detail: (event as CustomEvent).detail,
        });
        try {
          await fetch("/api/sessionLogout", { method: "POST" });
        } catch (e) {
          logger.warn("[AuthProvider] Failed to clear session cookie", { error: e });
        }
        if (authStateManager) {
          hasInitialized.current = false;
          await initAuth({
            communityConfig,
            liffService,
            authStateManager,
            ssrCurrentUser: null,
            ssrLineAuthenticated: false,
            ssrPhoneAuthenticated: false,
          });
        }
      } finally {
        isHandling = false;
      }
    };

    window.addEventListener("auth:token-expired", handleTokenExpired);
    return () => window.removeEventListener("auth:token-expired", handleTokenExpired);
  }, [authStateManager, communityConfig, hasInitialized, liffService]);
};
