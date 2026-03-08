import { useEffect, useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const liffAppId = communityConfig?.liffAppId ?? undefined;

  useEffect(() => {
    logger.info("[useAuthDependencies] Resolving auth dependencies", {
      configIsNull: communityConfig === null,
      communityId: communityConfig?.communityId,
      liffAppId,
      component: "useAuthDependencies",
    });
  }, [communityConfig, liffAppId]);

  const liffService = useMemo(() => {
    return LiffService.getInstance(liffAppId);
  }, [liffAppId]);

  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);

  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
