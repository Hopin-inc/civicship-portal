"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/hooks/auth/auth-store";

interface UseFirebaseAuthStateProps {
  authStateManager: AuthStateManager | null;
}

export const useFirebaseAuthState = ({ authStateManager }: UseFirebaseAuthStateProps) => {
  const setState = useAuthStore((s) => s.setState);
  const state = useAuthStore((s) => s.state);

  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);

  authStateManagerRef.current = authStateManager;
  stateRef.current = state;

  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      setState({
        firebaseUser: user,
        authenticationState: user
          ? stateRef.current.authenticationState === "loading"
            ? "line_authenticated"
            : stateRef.current.authenticationState
          : "unauthenticated",
      });

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
  }, [setState]);
};
