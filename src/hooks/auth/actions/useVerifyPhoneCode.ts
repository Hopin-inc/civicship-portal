import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useVerifyPhoneCode = (
  phoneAuthService: PhoneAuthService,
  authStateManager: AuthStateManager | null,
) => {
  const setAuthState = useAuthStore((s) => s.setState);
  const setPhoneAuth = useAuthStore((s) => s.setPhoneAuth);

  return useCallback(
    async (verificationCode: string): Promise<boolean> => {
      const result = await phoneAuthService.verifyPhoneCode(verificationCode);

      if (!result.success) return false;

      const tokens = result.tokens
        ? {
            accessToken: result.tokens.accessToken ?? null,
            refreshToken: result.tokens.refreshToken ?? null,
            expiresAt: result.tokens.expiresAt ?? null,
          }
        : undefined;

      setPhoneAuth({
        phoneUid: result.phoneUid ?? null,
        isVerified: true,
        phoneTokens: tokens,
        error: null,
      });

      setAuthState({ authenticationState: "phone_authenticated" });

      if (authStateManager) {
        try {
          await authStateManager.handlePhoneAuthStateChange(true);
          logger.debug("AuthStateManager phone state updated successfully");
        } catch (err) {
          logger.warn("Failed to update AuthStateManager phone state", {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      return true;
    },
    [setAuthState, setPhoneAuth, phoneAuthService, authStateManager],
  );
};
