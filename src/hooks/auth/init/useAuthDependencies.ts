import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useAuthDependencies() {
  const communityConfig = useCommunityConfig();
  
  // Get LIFF ID and Firebase tenant ID from community config (runtime) or fallback to env var (build-time)
  const liffId = communityConfig?.liffId || process.env.NEXT_PUBLIC_LIFF_ID || "";
  const communityId = communityConfig?.communityId || process.env.NEXT_PUBLIC_COMMUNITY_ID || "default";
  const firebaseTenantId = communityConfig?.firebaseTenantId || process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID || null;
  
  const liffService = useMemo(() => {
    if (!liffId) {
      // Return a placeholder service that will fail gracefully
      // This can happen during initial render before config is loaded
      return LiffService.getInstance(process.env.NEXT_PUBLIC_LIFF_ID || "", communityId, firebaseTenantId);
    }
    return LiffService.getInstance(liffId, communityId, firebaseTenantId);
  }, [liffId, communityId, firebaseTenantId]);
  
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
