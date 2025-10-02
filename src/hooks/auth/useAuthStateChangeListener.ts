"use client";

import { useEffect } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/types/auth";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { logger } from "@/lib/logging";

interface UseAuthStateChangeListenerProps {
  authStateManager: AuthStateManager | null;
}

export const useAuthStateChangeListener = ({
  authStateManager,
}: UseAuthStateChangeListenerProps) => {
  const setState = useAuthStore((s) => s.setState);

  useEffect(() => {
    if (!authStateManager) return;
    const handleStateChange = (newState: AuthState["authenticationState"]) => {
      logger.debug("AuthStateManager → Store", {
        from: useAuthStore.getState().state.authenticationState,
        to: newState,
      });
      setState({ authenticationState: newState });
    };

    authStateManager.addStateChangeListener(handleStateChange);

    return () => {
      authStateManager.removeStateChangeListener(handleStateChange);
    };
  }, [authStateManager, setState]);
};
