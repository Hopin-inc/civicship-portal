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
      const current = useAuthStore.getState().state.authenticationState;

      if (current === "loading" && newState === "unauthenticated") {
        logger.debug("⏭ skip unauthenticated during loading phase");
        return;
      }

      if (current === newState) return;

      logger.debug("AuthStateManager → updateState", { from: current, to: newState });

      // ✅ 状態遷移はすべて Manager を通す
      authStateManager.updateState(newState, "useAuthStateChangeListener");
    };

    authStateManager.addStateChangeListener(handleStateChange);
    return () => authStateManager.removeStateChangeListener(handleStateChange);
  }, [authStateManager]);
};
