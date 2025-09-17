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

export const usePhoneAuthState = ({
  authStateManager,
  phoneAuthService,
  setState,
}: UsePhoneAuthStateProps) => {
  useEffect(() => {
    /**
     * 🔒 本来の電話番号認証ロジック（コメントアウトして残す）
     */
    /*
    const currentAuthStateManager = authStateManager;
    if (!currentAuthStateManager) return;

    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          await currentAuthStateManager.handlePhoneAuthStateChange(true);
        } catch (error) {
          logger.error("Failed to update AuthStateManager phone state in useEffect", {
            error: error instanceof Error ? error.message : String(error),
            component: "usePhoneAuthState"
          });
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
    */

    /**
     * 🎯 常に phone_authenticated にする (本番仕様)
     */
    setState((prev) => ({
      ...prev,
      authenticationState:
        prev.authenticationState === "line_authenticated"
          ? "phone_authenticated"
          : prev.authenticationState,
    }));
  }, [setState]);
};
