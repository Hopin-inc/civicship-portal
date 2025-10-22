"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

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
          const expirationTime = String(new Date(tokenResult.expirationTime).getTime());

          const newAuthState =
            stateRef.current.authenticationState === "loading" && !stateRef.current.isAuthInProgress
              ? "line_authenticated"
              : stateRef.current.authenticationState;

          logger.info("🔍 [useFirebaseAuthState] Firebase auth state changed:", {
            currentState: stateRef.current.authenticationState,
            isAuthInProgress: stateRef.current.isAuthInProgress,
            isAuthenticating: stateRef.current.isAuthenticating,
            willSetStateTo: newAuthState,
            firebaseUserId: user.uid,
          });

          setState({
            firebaseUser: user,
            lineTokens: {
              accessToken: idToken,
              refreshToken,
              expiresAt: expirationTime,
            },
            authenticationState: newAuthState,
          });

          TokenManager.saveLineAuthFlag(true);
        } catch (error) {
          logger.info("Failed to sync Firebase token", {
            error: error instanceof Error ? error.message : String(error),
            component: "useFirebaseAuthState",
          });
        }
      } else {
        TokenManager.clearLineAuthFlag();
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
