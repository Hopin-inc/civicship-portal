"use client";

import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";

export const useAuthStateManagerInitialization = (authStateManager: AuthStateManager | null) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("[Debug] 🔥 useAuthStateManagerInitialization fired.");
    
    if (!authStateManager) return;

    const initializeAuthState = async () => {
      console.log("🔍 Initializing AuthStateManager");
      await authStateManager.initialize();
      setIsInitialized(true);
    };

    initializeAuthState();
  }, [authStateManager]);

  return { isInitialized };
};
