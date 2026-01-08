import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useAuthDependencies() {
  const communityConfig = useCommunityConfig();
  // Get LIFF ID from DB config, fallback to env var for backward compatibility
  const liffId = communityConfig?.liffId || process.env.NEXT_PUBLIC_LIFF_ID || "";
  const liffService = useMemo(() => LiffService.getInstance(liffId), [liffId]);
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
