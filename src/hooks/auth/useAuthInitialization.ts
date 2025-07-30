"use client";

import { useEffect, useState } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthInitializationContext } from "@/types/auth";
import { logger } from "@/lib/logging";

export const useAuthInitialization = (authStateManager: AuthStateManager | null) => {
  const [initializationContext, setInitializationContext] = useState<AuthInitializationContext>({
    state: "not_started",
    progress: 0,
    retryCount: 0
  });

  useEffect(() => {
    if (!authStateManager) return;

    const handleInitializationChange = (context: AuthInitializationContext) => {
      setInitializationContext(context);
      
      logger.debug("Auth initialization progress", {
        state: context.state,
        progress: context.progress,
        component: "useAuthInitialization"
      });
    };

    authStateManager.addInitializationListener(handleInitializationChange);

    const initializeAuth = async () => {
      try {
        await authStateManager.initialize();
      } catch (error) {
        logger.error("Auth initialization failed", {
          error: error instanceof Error ? error.message : String(error),
          component: "useAuthInitialization"
        });
      }
    };

    if (initializationContext.state === "not_started") {
      initializeAuth();
    }

    return () => {
      authStateManager.removeInitializationListener(handleInitializationChange);
    };
  }, [authStateManager]);

  const retryInitialization = async () => {
    if (authStateManager) {
      await authStateManager.retryInitialization();
    }
  };

  return {
    initializationContext,
    isInitialized: initializationContext.state === "completed",
    isInitializing: ["not_started", "checking_tokens", "checking_user", "hydrating"].includes(initializationContext.state),
    hasFailed: initializationContext.state === "failed",
    retryInitialization
  };
};
