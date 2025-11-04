import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { logger } from "@/lib/logging";
import { logFirebaseError } from "@/lib/auth/core/firebase-config";
import { useAuthStore } from "@/lib/auth/core/auth-store";

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
        logFirebaseError(
          error,
          "Failed to start phone verification",
          {
            phoneNumber,
            component: "AuthActions",
          }
        );
        return null;
      } finally {
        setPhoneAuth({ isVerifying: false });
      }
    },
    [setPhoneAuth, phoneAuthService],
  );
};
