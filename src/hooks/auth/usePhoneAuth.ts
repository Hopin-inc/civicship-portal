"use client";

import { useEffect } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthService } from "@/lib/auth/auth-service";

export const usePhoneAuth = (
  onAuthStateChange: (updater: (prev: string) => string) => void
) => {
  const phoneAuthService = PhoneAuthService.getInstance();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          const timestamp = new Date().toISOString();
          console.log(`🔍 [${timestamp}] Updating phone auth state in useEffect - isVerified:`, isVerified);
          await authService.handlePhoneAuthSuccess();
          console.log(`🔍 [${timestamp}] Auth state updated to phone_authenticated in useEffect`);
        } catch (error) {
          console.error("Failed to update auth state in useEffect:", error);
        }
      };

      updatePhoneAuthState();
    }

    onAuthStateChange((prev) => isVerified ?
      (prev === "line_authenticated" ? "phone_authenticated" : prev) :
      prev
    );
  }, [phoneAuthService, authService, onAuthStateChange]);

  return phoneAuthService;
};
