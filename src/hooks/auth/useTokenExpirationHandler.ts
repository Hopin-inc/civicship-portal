"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { AuthState } from "@/contexts/AuthProvider";

interface UseTokenExpirationHandlerProps {
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => Promise<void>;
}

export const useTokenExpirationHandler = ({ state, setState, logout }: UseTokenExpirationHandlerProps) => {
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    console.log("[Debug] 🔥 useTokenExpirationHandler fired.");
    
    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ source: string }>;
      const { source } = customEvent.detail;

      if (source === "graphql" || source === "network") {
        const currentState = stateRef.current.authenticationState;
        
        if (currentState === "line_authenticated" || currentState === "user_registered") {
          setState((prev) => ({ ...prev, authenticationState: "line_token_expired" }));
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-line-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        if (currentState === "phone_authenticated") {
          setState((prev) => ({ ...prev, authenticationState: "phone_token_expired" }));
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
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:token-expired", handleTokenExpired);
      }
    };
  }, [setState, logout]);
};
