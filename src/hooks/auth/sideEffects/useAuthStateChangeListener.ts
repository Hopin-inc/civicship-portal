"use client";

import { useEffect } from "react";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { AuthState } from "@/types/auth";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";

interface UseAuthStateChangeListenerProps {
  authStateManager: AuthStateManager | null;
}

export const useAuthStateChangeListener = ({
  authStateManager,
}: UseAuthStateChangeListenerProps) => {
  useEffect(() => {
    if (!authStateManager) return;

    const handleStateChange = (newState: AuthState["authenticationState"]) => {
      const currentState = useAuthStore.getState().state.authenticationState;

      if (currentState === "loading" && newState === "unauthenticated") {
        logger.debug("⏭ skip unauthenticated during loading phase");
        return;
      }

      if (currentState === newState) return;

      authStateManager.updateState(newState, "useAuthStateChangeListener");
    };

    authStateManager.addStateChangeListener(handleStateChange);
    return () => authStateManager.removeStateChangeListener(handleStateChange);
  }, [authStateManager]);
};
