import { useCallback } from "react";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { lineAuth } from "@/lib/auth/core/firebase-config";

export const useLogout = (liffService: LiffService, phoneAuthService: PhoneAuthService) => {
  const setState = useAuthStore((s) => s.setState);
  return useCallback(async () => {
    try {
      // Sign out from Firebase to clear persisted auth state
      await signOut(lineAuth);

      // Clear LIFF and phone auth state
      liffService.logout();
      phoneAuthService.reset();

      // Clear auth cookies
      TokenManager.clearAllAuthFlags();

      // Clear session cookie via API
      try {
        await fetch("/api/sessionLogout", { method: "POST" });
      } catch (e) {
        logger.warn("Failed to clear session cookie", { error: e });
      }

      // Update auth store state
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
