"use client";

import { useEffect, useRef } from "react";
import { AuthenticationState, AuthStateStore } from "@/lib/auth/auth-state-store";
import { AuthService } from "@/lib/auth/auth-service";
import { TokenService } from "@/lib/auth/token-service";
import { toast } from "sonner";

export const useTokenExpiration = (
  authenticationState: string,
  isAuthenticating: boolean,
  onAuthStateChange: (state: AuthenticationState) => void,
  logout: () => Promise<void>
) => {
  const authStateStore = AuthStateStore.getInstance();
  const authService = AuthService.getInstance();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeAuthState = async () => {
      if (hasInitialized.current) return;
      
      if (isAuthenticating) {
        console.log("🔍 Skipping auth state initialization - authentication in progress");
        return;
      }

      console.log("🔍 Initializing authentication state");
      await authService.initializeAuthState(isAuthenticating);

      const tokenService = TokenService.getInstance();
      const phoneTokens = tokenService.getPhoneTokens();
      const lineTokens = tokenService.getLineTokens();

      const currentState = authStateStore.getState();

      if (currentState === "phone_authenticated") {
        const isPhoneValid = await tokenService.isPhoneTokenValid(phoneTokens);
        if (!isPhoneValid) {
          console.log("🔄 Phone tokens expired, handling token expiration");
          await authService.handleTokenExpired("phone");
        }
      }

      if (currentState === "line_authenticated" || currentState === "user_registered") {
        const isLineValid = await tokenService.isLineTokenValid(lineTokens);
        if (!isLineValid) {
          console.log("🔄 LINE tokens expired, handling token expiration");
          await authService.handleTokenExpired("line");
        }
      }

      hasInitialized.current = true;
    };

    initializeAuthState();

    const handleStateChange = (newState: AuthenticationState) => {
      onAuthStateChange(newState);
    };

    authStateStore.addStateChangeListener(handleStateChange);

    const handleTokenExpired = async (event: Event) => {
      const customEvent = event as CustomEvent<{ source: string }>;
      const { source } = customEvent.detail;

      if (source === "graphql" || source === "network") {
        if (authenticationState === "line_authenticated" || authenticationState === "user_registered") {
          await authService.handleTokenExpired("line");
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-line-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        if (authenticationState === "phone_authenticated") {
          await authService.handleTokenExpired("phone");
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-phone-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        toast.error("認証の有効期限が切れました", {
          description: "再度ログインしてください",
        });
        await logout();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:token-expired", handleTokenExpired);
    }

    return () => {
      authStateStore.removeStateChangeListener(handleStateChange);
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:token-expired", handleTokenExpired);
      }
    };
  }, [authService, authStateStore, authenticationState, isAuthenticating, logout, onAuthStateChange]);
};
