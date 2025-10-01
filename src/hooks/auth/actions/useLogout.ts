import React, { useCallback } from "react";
import { toast } from "sonner";
import { TokenManager } from "@/lib/auth/token-manager";
import { logger } from "@/lib/logging";
import { AuthState } from "@/types/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";

export const useLogout = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  liffService: LiffService,
  phoneAuthService: PhoneAuthService,
) => {
  return useCallback(async () => {
    try {
      liffService.logout();
      phoneAuthService.reset();
      TokenManager.clearAllTokens();
      setState((prev) => ({
        ...prev,
        firebaseUser: null,
        currentUser: null,
        authenticationState: "unauthenticated",
      }));
    } catch (error) {
      logger.warn("Logout failed", { error });
      toast.error("ログアウトに失敗しました");
    }
  }, [setState, liffService, phoneAuthService]);
};
