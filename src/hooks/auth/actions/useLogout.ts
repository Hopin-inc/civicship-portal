import { useCallback } from "react";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { logger } from "@/lib/logging";
import { LiffService } from "@/lib/auth/service/liff-service";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { lineAuth, getPhoneAuth } from "@/lib/auth/core/firebase-config";

export const useLogout = (liffService: LiffService, phoneAuthService: PhoneAuthService) => {
  const setState = useAuthStore((s) => s.setState);
  return useCallback(async () => {
    try {
      // 1. Clear server-side session cookie via API
      try {
        await fetch("/api/sessionLogout", {
          method: "POST",
          credentials: "include",
        });
      } catch (apiError) {
        logger.warn("Session logout API call failed", { error: apiError });
      }

      // 2. Sign out from Firebase Auth (both LINE and Phone auth instances)
      try {
        await signOut(lineAuth);
      } catch (firebaseError) {
        logger.warn("Firebase LINE auth signOut failed", { error: firebaseError });
      }
      
      try {
        const phoneAuth = getPhoneAuth();
        await signOut(phoneAuth);
      } catch (firebaseError) {
        logger.warn("Firebase Phone auth signOut failed", { error: firebaseError });
      }

      // 3. Clear LIFF state
      liffService.logout();
      
      // 4. Reset phone auth service
      phoneAuthService.reset();
      
      // 5. Clear local auth flags/cookies
      TokenManager.clearAllAuthFlags();
      TokenManager.clearDeprecatedCookies();
      
      // 6. Reset Zustand auth store
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
