import { useCallback } from "react";
import { toast } from "sonner";
import { TokenManager } from "@/lib/auth/token-manager";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useLogout = (liffService: LiffService, phoneAuthService: PhoneAuthService) => {
  const setState = useAuthStore((s) => s.setState);
  return useCallback(async () => {
    try {
      liffService.logout();
      phoneAuthService.reset();
      TokenManager.clearAllAuthFlags();
      setState({
        firebaseUser: null,
        currentUser: null,
        authenticationState: "unauthenticated",
        lineTokens: {
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        },
      });
    } catch (error) {
      logger.warn("Logout failed", { error });
      toast.error("ログアウトに失敗しました");
    }
  }, [setState, liffService, phoneAuthService]);
};
