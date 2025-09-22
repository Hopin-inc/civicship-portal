"use client";

import { useEffect, useRef } from "react";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/types/auth";
import { logger } from "@/lib/logging";

interface UsePhoneAuthStateProps {
  authStateManager: AuthStateManager | null;
  phoneAuthService: PhoneAuthService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const usePhoneAuthState = ({
  authStateManager,
  phoneAuthService,
  setState,
}: UsePhoneAuthStateProps) => {
  const authStateManagerRef = useRef(authStateManager);
  const phoneAuthServiceRef = useRef(phoneAuthService);

  authStateManagerRef.current = authStateManager;
  phoneAuthServiceRef.current = phoneAuthService;

  useEffect(() => {
    const currentAuthStateManager = authStateManagerRef.current;

    if (!currentAuthStateManager) return;

    if (currentAuthStateManager.getState() === "initializing") {
      return;
    }

    const phoneState = phoneAuthServiceRef.current.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          await currentAuthStateManager.handlePhoneAuthStateChange(true);
        } catch (error) {
          logger.error("Failed to update AuthStateManager phone state in useEffect", {
            error: error instanceof Error ? error.message : String(error),
            component: "usePhoneAuthState",
          });
        }
      };

      updatePhoneAuthState();
    }

    setState((prev) => ({
      ...prev,
      authenticationState: isVerified
        ? prev.authenticationState === "line_authenticated" || prev.authenticationState === "initializing"
          ? "phone_authenticated"
          : prev.authenticationState
        : prev.authenticationState,
    }));
  }, [setState, authStateManager]);
};
