import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { logger } from "@/lib/logging";

export function useAuthDependencies() {
  const communityConfig = useCommunityConfig();
  // Get LIFF App ID from DB config for liff.init(), fallback to env var for backward compatibility
  // liffAppId is the full LIFF app ID (e.g., '1234567890-xxxxxxxx') used for liff.init()
  // liffId is the channel ID used for token verification
  const liffAppId = communityConfig?.liffAppId || process.env.NEXT_PUBLIC_LIFF_ID || "";
  
  logger.info("[LIFF DEBUG] useAuthDependencies() - resolving liffAppId", {
    component: "useAuthDependencies",
    communityConfigLiffAppId: communityConfig?.liffAppId || "(null)",
    envLiffId: process.env.NEXT_PUBLIC_LIFF_ID || "(not set)",
    resolvedLiffAppId: liffAppId || "(empty)",
    hasCommunityConfig: !!communityConfig,
  });
  
  const liffService = useMemo(() => LiffService.getInstance(liffAppId), [liffAppId]);
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
