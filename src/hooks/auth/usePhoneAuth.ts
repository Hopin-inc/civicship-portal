"use client";

import { useEffect } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthService } from "@/lib/auth/auth-service";
import { AuthenticationState } from "@/lib/auth/auth-state-store";

export const usePhoneAuth = (
  onAuthStateChange: (updater: (prev: AuthenticationState) => AuthenticationState) => void
) => {
  const phoneAuthService = PhoneAuthService.getInstance();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        console.log("👀 updatePhoneAuthState started!")
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

    onAuthStateChange((prev) => {
      if (isVerified && prev !== "user_registered" && prev !== "phone_authenticated") {
        return "phone_authenticated";
      }
      return prev;
    });
  }, [phoneAuthService, authService, onAuthStateChange]);

  return phoneAuthService;
};
