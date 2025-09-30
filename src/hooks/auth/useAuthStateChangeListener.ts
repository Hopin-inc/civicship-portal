"use client";

import { useEffect } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/types/auth";

interface UseAuthStateChangeListenerProps {
  authStateManager: AuthStateManager | null;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  enabled?: boolean;
}

export const useAuthStateChangeListener = ({
  authStateManager,
  setState,
  enabled = true,
}: UseAuthStateChangeListenerProps) => {
  useEffect(() => {
    if (!authStateManager || !enabled) return;

    const handleStateChange = (newState: AuthState["authenticationState"]) => {
      setState((prev) => ({ ...prev, authenticationState: newState }));
    };

    authStateManager.addStateChangeListener(handleStateChange);

    return () => {
      authStateManager.removeStateChangeListener(handleStateChange);
    };
  }, [authStateManager, setState]);
};
