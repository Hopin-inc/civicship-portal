import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { setLineAuthTenantId } from "@/lib/auth/core/firebase-config";
import { CommunityPortalConfig } from "@/lib/communities/config";

export function useAuthDependencies(communityConfig: CommunityPortalConfig | null) {
  const liffAppId = communityConfig?.liffAppId ?? undefined;
  const firebaseTenantId = communityConfig?.firebaseTenantId ?? null;

  const liffService = useMemo(() => {
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
