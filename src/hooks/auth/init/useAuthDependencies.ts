import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useAuthDependencies() {
  const communityConfig = useCommunityConfig();
  
  // Get LIFF App ID and Firebase tenant ID from community config (runtime) or fallback to env var (build-time)
  // Note: liffAppId is the full LIFF ID (e.g., "1234567890-xxxxxxxx") used for liff.init()
  // liffId is the channel ID used for token verification on the backend
  const liffAppId = communityConfig?.liffAppId || communityConfig?.liffId || process.env.NEXT_PUBLIC_LIFF_ID || "";
  const communityId = communityConfig?.communityId || process.env.NEXT_PUBLIC_COMMUNITY_ID || "default";
  const firebaseTenantId = communityConfig?.firebaseTenantId || process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID || null;
  
  const liffService = useMemo(() => {
    if (!liffAppId) {
      // Return a placeholder service that will fail gracefully
      // This can happen during initial render before config is loaded
      return LiffService.getInstance(process.env.NEXT_PUBLIC_LIFF_ID || "", communityId, firebaseTenantId);
    }
    return LiffService.getInstance(liffAppId, communityId, firebaseTenantId);
  }, [liffAppId, communityId, firebaseTenantId]);
  
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
