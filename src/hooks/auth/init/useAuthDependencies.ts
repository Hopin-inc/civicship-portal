import { useMemo } from "react";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { useCommunityContext } from "@/contexts/CommunityContext";
import { getAuthForCommunity, getEnvAuthConfig } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";

export function useAuthDependencies() {
  const { communityId } = useCommunityContext();
  
  const liffId = useMemo(() => {
    const envLiffId = getEnvAuthConfig().liffId;
    if (envLiffId) return envLiffId;
    
    if (communityId) {
      const authConfig = getAuthForCommunity(communityId as CommunityId);
      return authConfig.liffId;
    }
    
    return "";
  }, [communityId]);

  const liffService = useMemo(() => LiffService.getInstance(liffId), [liffId]);
  const phoneAuthService = useMemo(() => PhoneAuthService.getInstance(), []);
  const authStateManager = useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  return { liffService, phoneAuthService, authStateManager };
}
