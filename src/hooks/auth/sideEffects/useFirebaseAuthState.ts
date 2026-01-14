"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

interface UseFirebaseAuthStateProps {
  authStateManager: AuthStateManager | null;
  hasFullAuth: boolean;
}

export const useFirebaseAuthState = ({
  authStateManager,
  hasFullAuth,
}: UseFirebaseAuthStateProps) => {
  const setState = useAuthStore((s) => s.setState);
  const state = useAuthStore((s) => s.state);

  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);

  authStateManagerRef.current = authStateManager;
  stateRef.current = state;

  useEffect(() => {
    // 🚫 SSRで full-auth の場合は何もしない
    if (hasFullAuth) return;

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      const prevUser = stateRef.current.firebaseUser;

      if (prevUser?.uid === user?.uid) return;

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = String(new Date(tokenResult.expirationTime).getTime());

          setState({
            firebaseUser: user,
            lineTokens: {
              accessToken: idToken,
              refreshToken,
              expiresAt: expirationTime,
            },
            authenticationState:
              stateRef.current.authenticationState === "loading"
                ? "line_authenticated"
                : stateRef.current.authenticationState,
          });

          TokenManager.saveLineAuthFlag(true);
        } catch (error) {
          logger.warn("Failed to sync Firebase token", {
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
  }, [hasFullAuth, setState]);
};
