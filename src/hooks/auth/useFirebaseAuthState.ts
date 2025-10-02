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
      const prevUser = stateRef.current.firebaseUser;

      if (prevUser?.uid === user?.uid) return;

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

          const existing = TokenManager.getLineTokens();
          if (
            !existing.accessToken ||
            existing.accessToken !== idToken ||
            !existing.expiresAt ||
            existing.expiresAt !== expirationTime
          ) {
            TokenManager.saveLineTokens({
              accessToken: idToken,
              refreshToken,
              expiresAt: expirationTime,
            });
          }

          setState({
            firebaseUser: user,
            authenticationState:
              stateRef.current.authenticationState === "loading"
                ? "line_authenticated"
                : stateRef.current.authenticationState,
          });
        } catch (error) {
          logger.info("Failed to sync Firebase token to cookies", {
            error: error instanceof Error ? error.message : String(error),
            component: "useFirebaseAuthState",
          });
        }
      } else {
        TokenManager.clearLineTokens();
        setState({
          firebaseUser: null,
          authenticationState: "unauthenticated",
        });
      }

      const currentAuthStateManager = authStateManagerRef.current;
      if (currentAuthStateManager && !stateRef.current.isAuthenticating) {
        void currentAuthStateManager.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [setState]);
};
