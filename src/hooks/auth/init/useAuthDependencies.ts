import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useAuthDependencies() {
  const communityConfig = useCommunityConfig();
  // Get LIFF App ID from DB config for liff.init(), fallback to env var for backward compatibility
  // liffAppId is the full LIFF app ID (e.g., '1234567890-xxxxxxxx') used for liff.init()
  // liffId is the channel ID used for token verification
  const liffAppId = communityConfig?.liffAppId || process.env.NEXT_PUBLIC_LIFF_ID || "";
  
  // Debug logging for LIFF ID configuration
  console.log("[useAuthDependencies] LIFF ID config:", {
    communityId: communityConfig?.communityId,
    liffAppIdFromConfig: communityConfig?.liffAppId,
    liffIdFromConfig: communityConfig?.liffId,
    envLiffId: process.env.NEXT_PUBLIC_LIFF_ID,
    resolvedLiffAppId: liffAppId,
    source: communityConfig?.liffAppId ? "communityConfig" : process.env.NEXT_PUBLIC_LIFF_ID ? "env" : "empty",
  });
  
  const liffService = useMemo(() => LiffService.getInstance(liffAppId), [liffAppId]);
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
