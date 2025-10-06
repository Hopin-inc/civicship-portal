import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useStartPhoneVerification = (
  phoneAuthService: PhoneAuthService,
  authStateManager: AuthStateManager | null,
) => {
  const setPhoneAuth = useAuthStore((s) => s.setPhoneAuth);

  return useCallback(
    async (phoneNumber: string): Promise<string | null> => {
      setPhoneAuth({ isVerifying: true, error: null });

      try {
        const verificationId = await phoneAuthService.startPhoneVerification(phoneNumber);

        if (verificationId) {
          setPhoneAuth({ phoneNumber, verificationId });
          logger.debug("Phone verification started successfully", {
            phoneNumber,
            component: "AuthActions",
          });
        }

        return verificationId;
      } catch (error) {
        setPhoneAuth({ error: error as Error });
        logger.error("Failed to start phone verification", {
          error: error instanceof Error ? error.message : String(error),
          phoneNumber,
          component: "AuthActions",
        });
        return null;
      } finally {
        setPhoneAuth({ isVerifying: false });
        if (authStateManager) {
          try {
            await authStateManager.handlePhoneAuthStateChange(false);
          } catch (err) {
            logger.warn("AuthStateManager phone init failed", {
              error: err instanceof Error ? err.message : String(err),
              component: "AuthActions",
            });
          }
        }
      }
    },
    [setPhoneAuth, phoneAuthService, authStateManager],
  );
};
