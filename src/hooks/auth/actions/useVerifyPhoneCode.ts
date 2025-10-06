import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useVerifyPhoneCode = (
  phoneAuthService: PhoneAuthService,
  authStateManager: AuthStateManager | null,
) => {
  const setState = useAuthStore((s) => s.setState);

  return useCallback(
    async (verificationCode: string): Promise<boolean> => {
      const success = await phoneAuthService.verifyPhoneCode(verificationCode);

      if (success) {
        setState({ authenticationState: "phone_authenticated" });

        if (authStateManager) {
          try {
            const timestamp = new Date().toISOString();
            logger.debug("Updating phone auth state", { timestamp, component: "AuthActions" });
            await authStateManager.handlePhoneAuthStateChange(true);
            logger.debug("AuthStateManager phone state updated successfully", {
              timestamp,
              component: "AuthActions",
            });
          } catch (error) {
            logger.warn("Failed to update AuthStateManager phone state", {
              error: error instanceof Error ? error.message : String(error),
              component: "AuthActions",
              errorCategory: "state_management",
              retryable: true,
            });
          }
        }
      }

      return success;
    },
    [setState, phoneAuthService, authStateManager],
  );
};
