import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { setLineAuthTenantId } from "@/lib/auth/core/firebase-config";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const liffAppId = communityConfig?.liffAppId ?? undefined;
  const firebaseTenantId = communityConfig?.firebaseTenantId ?? null;

  const liffService = useMemo(() => {
    logger.info("[useAuthDependencies] Resolving auth dependencies", {
      configIsNull: communityConfig === null,
      communityId: communityConfig?.communityId,
      firebaseTenantId,
      liffAppId,
      component: "useAuthDependencies",
    });
    setLineAuthTenantId(firebaseTenantId);
    return LiffService.getInstance(liffAppId);
  }, [liffAppId, firebaseTenantId]);

  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
