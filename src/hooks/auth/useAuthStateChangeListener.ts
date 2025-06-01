"use client";

import { useEffect } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";

interface UseAuthStateChangeListenerProps {
  authStateManager: AuthStateManager | null;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useAuthStateChangeListener = ({ authStateManager, setState }: UseAuthStateChangeListenerProps) => {
  useEffect(() => {
    console.log("[Debug] 🔥 useAuthStateChangeListener fired.");
    
    if (!authStateManager) return;

    const handleStateChange = (newState: AuthState["authenticationState"]) => {
      setState((prev) => ({ ...prev, authenticationState: newState }));
    };

    authStateManager.addStateChangeListener(handleStateChange);

    return () => {
      authStateManager.removeStateChangeListener(handleStateChange);
    };
  }, [authStateManager, setState]);
};
