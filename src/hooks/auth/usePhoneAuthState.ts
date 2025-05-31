"use client";

import { useEffect } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";

interface UsePhoneAuthStateProps {
  authStateManager: AuthStateManager | null;
  phoneAuthService: PhoneAuthService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const usePhoneAuthState = ({ authStateManager, phoneAuthService, setState }: UsePhoneAuthStateProps) => {
  useEffect(() => {
    if (!authStateManager) return;

    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          const timestamp = new Date().toISOString();
          console.log(
            `🔍 [${timestamp}] Updating phone auth state in useEffect - isVerified:`,
            isVerified,
          );
          await authStateManager.handlePhoneAuthStateChange(true);
          console.log(
            `🔍 [${timestamp}] AuthStateManager phone state updated successfully in useEffect`,
          );
        } catch (error) {
          console.error("Failed to update AuthStateManager phone state in useEffect:", error);
        }
      };

      updatePhoneAuthState();
    }

    setState((prev) => ({
      ...prev,
      authenticationState: isVerified
        ? prev.authenticationState === "line_authenticated"
          ? "phone_authenticated"
          : prev.authenticationState
        : prev.authenticationState,
    }));
  }, [authStateManager, phoneAuthService, setState]);
};
