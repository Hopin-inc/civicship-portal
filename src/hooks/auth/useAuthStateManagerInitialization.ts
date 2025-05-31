"use client";

import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import clientLogger from "@/lib/logging/client";

export const useAuthStateManagerInitialization = (authStateManager: AuthStateManager | null) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    clientLogger.debug("useAuthStateManagerInitialization fired", {
      component: "useAuthStateManagerInitialization"
    });
    
    if (!authStateManager) return;

    const initializeAuthState = async () => {
      clientLogger.debug("Initializing AuthStateManager", {
        component: "useAuthStateManagerInitialization"
      });
      await authStateManager.initialize();
      setIsInitialized(true);
    };

    initializeAuthState();
  }, [authStateManager]);

  return { isInitialized };
};
