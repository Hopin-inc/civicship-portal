"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

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
    if (state.authenticationState === "initializing") {
      return;
    }

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      setState((prev) => ({
        ...prev,
        firebaseUser: user,
        authenticationState: user
          ? prev.authenticationState === "loading" || prev.authenticationState === "initializing"
            ? "line_authenticated"
            : prev.authenticationState
          : "unauthenticated",
      }));

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

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
        await currentAuthStateManager.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [state.authenticationState]);
};
