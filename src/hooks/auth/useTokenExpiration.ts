"use client";

import { useEffect } from "react";
import { AuthenticationState, AuthStateStore } from "@/lib/auth/auth-state-store";
import { AuthService } from "@/lib/auth/auth-service";
import { toast } from "sonner";

export const useTokenExpiration = (
  authenticationState: string,
  onAuthStateChange: (state: AuthenticationState) => void,
  logout: () => Promise<void>
) => {
  const authStateStore = AuthStateStore.getInstance();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const initializeAuthState = async () => {
      console.log("🔍 Initializing authentication state");
      await authService.initializeAuthState();
    };

    initializeAuthState();

    const handleStateChange = (newState: AuthenticationState) => {
      onAuthStateChange(newState);
    };

    authStateStore.addStateChangeListener(handleStateChange);

    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ source: string }>;
      const { source } = customEvent.detail;

      if (source === "graphql" || source === "network") {
        if (authenticationState === "line_authenticated" || authenticationState === "user_registered") {
          authService.handleTokenExpired("line");
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-line-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        if (authenticationState === "phone_authenticated") {
          authService.handleTokenExpired("phone");
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-phone-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        toast.error("認証の有効期限が切れました", {
          description: "再度ログインしてください",
        });
        logout();
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
  }, [authenticationState, logout, authService, authStateStore, onAuthStateChange]);
};
