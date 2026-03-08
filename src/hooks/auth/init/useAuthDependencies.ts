import { useEffect, useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const miniAppLiffId = process.env.NEXT_PUBLIC_MINI_APP_LIFF_ID;

  useEffect(() => {
    if (!miniAppLiffId) {
      logger.error(
        "[useAuthDependencies] NEXT_PUBLIC_MINI_APP_LIFF_ID is not configured. LIFF/Mini App features will be unavailable.",
        { component: "useAuthDependencies" },
      );
    }
    logger.info("[useAuthDependencies] Resolving auth dependencies", {
      configIsNull: communityConfig === null,
      communityId: communityConfig?.communityId,
      miniAppLiffId,
      component: "useAuthDependencies",
    });
  }, [communityConfig, miniAppLiffId]);

  const liffService = useMemo(() => {
    return LiffService.getInstance(miniAppLiffId);
  }, [miniAppLiffId]);

  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);

  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
