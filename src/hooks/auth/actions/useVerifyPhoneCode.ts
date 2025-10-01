import { useCallback } from "react";
import { AuthState } from "@/types/auth";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";

export const useVerifyPhoneCode = (
  setState: React.Dispatch<React.SetStateAction<AuthState>>,
  phoneAuthService: PhoneAuthService,
  authStateManager: AuthStateManager | null,
) => {
  return useCallback(
    async (verificationCode: string): Promise<boolean> => {
      const success = await phoneAuthService.verifyPhoneCode(verificationCode);

      if (success) {
        setState((prev) => ({
          ...prev,
          authenticationState: "phone_authenticated",
        }));

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
