import { useEffect, useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { setLineAuthTenantId, setPhoneAuthTenantId } from "@/lib/auth/core/firebase-config";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const miniAppLiffId = process.env.NEXT_PUBLIC_MINI_APP_LIFF_ID;
  const firebaseTenantId = communityConfig?.firebaseTenantId ?? null;

  useEffect(() => {
    logger.info("[useAuthDependencies] Resolving auth dependencies", {
      configIsNull: communityConfig === null,
      communityId: communityConfig?.communityId,
      firebaseTenantId,
      miniAppLiffId,
      component: "useAuthDependencies",
    });
  }, [communityConfig, firebaseTenantId, miniAppLiffId]);

  const liffService = useMemo(() => {
    setLineAuthTenantId(firebaseTenantId);
    return LiffService.getInstance(miniAppLiffId);
  }, [miniAppLiffId, firebaseTenantId]);

  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);

  useEffect(() => {
    setPhoneAuthTenantId(firebaseTenantId);
  }, [firebaseTenantId]);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
