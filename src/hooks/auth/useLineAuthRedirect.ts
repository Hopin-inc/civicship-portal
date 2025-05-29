"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

export const useLineAuthRedirect = (
  authenticationState: string,
  isAuthenticating: boolean,
  environment: AuthEnvironment,
  liffService: LiffService,
  setIsAuthenticating: (value: boolean) => void,
  refetchUser: () => Promise<any>
) => {
  useEffect(() => {
    const handleLineAuthRedirect = async () => {
      if (typeof window === "undefined") return;
      if (isAuthenticating) return;
      if (authenticationState !== "unauthenticated" && authenticationState !== "loading") return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Detected LINE authentication redirect`);
      console.log(`🔍 [${timestamp}] Current state:`, {
        authenticationState,
        isAuthenticating,
        environment,
        windowHref: window.location.href
      });

      setIsAuthenticating(true);

      try {
        const liffSuccess = await liffService.initialize();
        if (liffSuccess) {
          const liffState = liffService.getState();
          console.log(`🔍 [${timestamp}] LIFF state after initialization:`, {
            isInitialized: liffState.isInitialized,
            isLoggedIn: liffState.isLoggedIn,
            userId: liffState.profile?.userId || "none",
            accessToken: liffService.getAccessToken() ? "present" : "missing"
          });

          if (liffState.isLoggedIn) {
            const success = await liffService.signInWithLiffToken();
            console.log(`🔍 [${timestamp}] signInWithLiffToken result:`, success);

            if (success) {
              console.log(`🔍 [${timestamp}] LINE authentication successful - refreshing user data`);
              await refetchUser();
            } else {
              console.error(`🔍 [${timestamp}] Failed to complete LINE authentication with LIFF token`);
            }
          } else {
            console.log(`🔍 [${timestamp}] LIFF not logged in after initialization`);
          }
        } else {
          console.error(`🔍 [${timestamp}] LIFF initialization failed during redirect completion`);
        }
      } catch (error) {
        console.error(`🔍 [${timestamp}] Error during LINE authentication completion:`, error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleLineAuthRedirect();
  }, [authenticationState, isAuthenticating, environment, liffService, refetchUser, setIsAuthenticating]);
};
