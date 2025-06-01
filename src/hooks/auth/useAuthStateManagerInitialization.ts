"use client";

import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import clientLogger from "@/lib/logging/client";

export const useAuthStateManagerInitialization = (authStateManager: AuthStateManager | null) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!authStateManager) return;

    const initializeAuthState = async () => {
      await authStateManager.initialize();
      setIsInitialized(true);
    };

    initializeAuthState();
  }, [authStateManager]);

  return { isInitialized };
};
