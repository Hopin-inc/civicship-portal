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

    logger.warn("[DEBUG] useFirebaseAuthState: Setting up onAuthStateChanged listener");

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      const prevUser = stateRef.current.firebaseUser;

      logger.warn("[DEBUG] useFirebaseAuthState: onAuthStateChanged fired", {
        hasUser: !!user,
        userId: user?.uid?.slice(-6),
        prevUserId: prevUser?.uid?.slice(-6),
        currentAuthState: stateRef.current.authenticationState,
        isAuthenticating: stateRef.current.isAuthenticating,
      });

      if (prevUser?.uid === user?.uid) {
        logger.warn("[DEBUG] useFirebaseAuthState: Same user, skipping");
        return;
      }

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = String(new Date(tokenResult.expirationTime).getTime());

          const newAuthState =
            stateRef.current.authenticationState === "loading"
              ? "line_authenticated"
              : stateRef.current.authenticationState;

          logger.warn("[DEBUG] useFirebaseAuthState: Setting state with user", {
            currentAuthState: stateRef.current.authenticationState,
            newAuthState,
            isAuthenticating: stateRef.current.isAuthenticating,
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
          logger.warn("Failed to sync Firebase token", {
            error: error instanceof Error ? error.message : String(error),
            component: "useFirebaseAuthState",
          });
        }
      } else {
        logger.warn("[DEBUG] useFirebaseAuthState: No user, setting unauthenticated");
        TokenManager.clearLineAuthFlag();
        setState({
          firebaseUser: null,
          authenticationState: "unauthenticated",
        });
      }

      const currentAuthStateManager = authStateManagerRef.current;
      logger.warn("[DEBUG] useFirebaseAuthState: Checking handleLineAuthStateChange", {
        hasAuthStateManager: !!currentAuthStateManager,
        isAuthenticating: stateRef.current.isAuthenticating,
        willCall: !!currentAuthStateManager && !stateRef.current.isAuthenticating,
      });
      if (currentAuthStateManager && !stateRef.current.isAuthenticating) {
        void currentAuthStateManager.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [hasFullAuth, setState]);
};
