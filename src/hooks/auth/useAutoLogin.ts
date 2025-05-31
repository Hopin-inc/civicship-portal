"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { AuthState } from "@/contexts/AuthProvider";

interface UseAutoLoginProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useAutoLogin = ({ environment, state, liffService, setState, refetchUser }: UseAutoLoginProps) => {
  useEffect(() => {
    console.log("[Debug] 🔁 useEffect(handleAutoLogin) fired");

    const handleAutoLogin = async () => {
      if (environment !== AuthEnvironment.LIFF) return;
      if (state.authenticationState !== "unauthenticated") return;
      if (state.isAuthenticating) return;

      const liffState = liffService.getState();
      if (!liffState.isInitialized || !liffState.isLoggedIn) return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Auto-logging in via LIFF`);

      setState((prev) => ({ ...prev, isAuthenticating: true }));
      try {
        const success = await liffService.signInWithLiffToken();
        if (success) {
          await refetchUser();
        }
      } catch (error) {
        console.error("Auto-login with LIFF failed:", error);
      } finally {
        setState((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleAutoLogin();
  }, [environment, state.authenticationState, state.isAuthenticating, liffService, setState, refetchUser]);
};
