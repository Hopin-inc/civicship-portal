import { useEffect, useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { setLineAuthTenantId, setPhoneAuthTenantId } from "@/lib/auth/core/firebase-config";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const liffAppId = communityConfig?.liffAppId ?? undefined;
  const firebaseTenantId = communityConfig?.firebaseTenantId ?? null;

  useEffect(() => {
    logger.info("[useAuthDependencies] Resolving auth dependencies", {
      configIsNull: communityConfig === null,
      communityId: communityConfig?.communityId,
      firebaseTenantId,
      liffAppId,
      component: "useAuthDependencies",
    });
  }, [communityConfig, firebaseTenantId, liffAppId]);

  const liffService = useMemo(() => {
    setLineAuthTenantId(firebaseTenantId);
    return LiffService.getInstance(liffAppId);
  }, [liffAppId, firebaseTenantId]);

  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);

  useEffect(() => {
    // Phone auth uses the parent Firebase project (no tenant),
    // matching backend's validateFirebasePhoneAuth which uses auth.verifyIdToken() without tenant.
    // Setting tenantId on phone auth causes auth/unsupported-tenant-operation.
    setPhoneAuthTenantId(null);
  }, []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
