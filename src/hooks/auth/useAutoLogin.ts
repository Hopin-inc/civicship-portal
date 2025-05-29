"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

export const useAutoLogin = (
  authenticationState: string,
  isAuthenticating: boolean,
  environment: AuthEnvironment,
  liffService: LiffService,
  setIsAuthenticating: (value: boolean) => void,
  refetchUser: () => Promise<any>
) => {
  useEffect(() => {
    const handleAutoLogin = async () => {
      console.log("👀 handleAutoLogin started!")
      if (environment !== AuthEnvironment.LIFF) return;
      if (authenticationState !== "unauthenticated") return;
      if (isAuthenticating) return;
      console.log("👀 handleAutoLogin continue condition met!")

      const liffState = liffService.getState();
      if (!liffState.isInitialized || !liffState.isLoggedIn) return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Auto-logging in via LIFF`);

      setIsAuthenticating(true);
      console.log("🔍 Starting auto-login processing - blocking other auth initialization");
      try {
        const success = await liffService.signInWithLiffToken();
        if (success) {
          await refetchUser();
        }
      } catch (error) {
        console.error("Auto-login with LIFF failed:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleAutoLogin();
  }, [environment, authenticationState, isAuthenticating, liffService, refetchUser, setIsAuthenticating]);
};
