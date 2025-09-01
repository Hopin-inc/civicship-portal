"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

import { AuthEnvironment } from "@/lib/auth/environment-detector";

interface UseFirebaseAuthStateProps {
  authStateManager: AuthStateManager | null;
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useFirebaseAuthState = ({
  authStateManager,
  state,
  setState,
}: UseFirebaseAuthStateProps) => {
  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);

  authStateManagerRef.current = authStateManager;
  stateRef.current = state;

  useEffect(() => {
    const startTime = performance.now();
    logger.debug("Firebase auth state change listener started", {
      component: "useFirebaseAuthState",
      timestamp: new Date().toISOString(),
    });

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      const authChangeStartTime = performance.now();
      logger.debug("Firebase auth state changed", {
        component: "useFirebaseAuthState",
        hasUser: !!user,
        timestamp: new Date().toISOString(),
      });

      setState((prev) => ({
        ...prev,
        firebaseUser: user,
        authenticationState: user
          ? prev.authenticationState === "loading"
            ? "line_authenticated"
            : prev.authenticationState
          : "unauthenticated",
      }));

      if (user) {
        try {
          const tokenStartTime = performance.now();
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();
          const tokenEndTime = performance.now();

          logger.debug("Firebase token retrieval completed", {
            component: "useFirebaseAuthState",
            duration: `${(tokenEndTime - tokenStartTime).toFixed(2)}ms`,
            timestamp: new Date().toISOString(),
          });

          TokenManager.saveLineTokens({
            accessToken: idToken,
            refreshToken: refreshToken,
            expiresAt: expirationTime,
          });
        } catch (error) {
          logger.info("Failed to sync Firebase token to cookies", {
            error: error instanceof Error ? error.message : String(error),
            component: "useFirebaseAuthState",
          });
        }
      } else {
        TokenManager.clearLineTokens();
      }

      const currentAuthStateManager = authStateManagerRef.current;
      const currentState = stateRef.current;
      if (currentAuthStateManager && !currentState.isAuthenticating) {
        const managerUpdateStartTime = performance.now();
        await currentAuthStateManager.handleLineAuthStateChange(!!user);
        const managerUpdateEndTime = performance.now();
        
        logger.debug("AuthStateManager update completed", {
          component: "useFirebaseAuthState",
          duration: `${(managerUpdateEndTime - managerUpdateStartTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
        });
      }

      const authChangeEndTime = performance.now();
      logger.debug("Firebase auth state change processing completed", {
        component: "useFirebaseAuthState",
        duration: `${(authChangeEndTime - authChangeStartTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    });

    const endTime = performance.now();
    logger.debug("Firebase auth state change listener setup completed", {
      component: "useFirebaseAuthState",
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
    });

    return () => unsubscribe();
  }, [setState]);
};
