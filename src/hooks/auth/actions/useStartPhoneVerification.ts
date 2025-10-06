import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";

export const useStartPhoneVerification = (phoneAuthService: PhoneAuthService) => {
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
      }
    },
    [setPhoneAuth, phoneAuthService],
  );
};
