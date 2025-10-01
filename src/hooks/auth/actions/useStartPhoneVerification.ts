import { useCallback } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";

export const useStartPhoneVerification = (phoneAuthService: PhoneAuthService) => {
  return useCallback(
    async (phoneNumber: string): Promise<string | null> => {
      return await phoneAuthService.startPhoneVerification(phoneNumber);
    },
    [phoneAuthService],
  );
};
