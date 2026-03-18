"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { signOut } from "firebase/auth";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

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
  const communityConfig = useCommunityConfig();

  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);
  const expectedTenantIdRef = useRef<string | null>(null);

  authStateManagerRef.current = authStateManager;
  stateRef.current = state;
  expectedTenantIdRef.current = communityConfig?.firebaseTenantId ?? null;

  useEffect(() => {
    // 🚫 SSRで full-auth の場合は何もしない
    if (hasFullAuth) return;

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      const prevUser = stateRef.current.firebaseUser;

      if (prevUser?.uid === user?.uid) return;

      if (user) {
        // テナント不一致チェック: localStorage にキャッシュされた別コミュニティの
        // ユーザーが復元された場合、トークンを上書きせずサインアウトする。
        const expectedTenantId = expectedTenantIdRef.current;
        if (expectedTenantId && user.tenantId !== expectedTenantId) {
          logger.warn("[useFirebaseAuthState] Tenant mismatch — cached user belongs to a different community, signing out", {
            expectedTenantId,
            actualTenantId: user.tenantId,
            uid: user.uid,
            component: "useFirebaseAuthState",
          });
          try {
            await signOut(lineAuth);
          } catch (error) {
            logger.error("[useFirebaseAuthState] Failed to sign out after tenant mismatch", {
              error: error instanceof Error ? error.message : String(error),
              expectedTenantId,
              actualTenantId: user.tenantId,
              uid: user.uid,
              component: "useFirebaseAuthState",
            });
          }
          return;
        }

        try {
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = String(new Date(tokenResult.expirationTime).getTime());

          setState({
            firebaseUser: user,
            lineTokens: {
              idToken: idToken,
              refreshToken,
              expiresAt: expirationTime,
            },
            authenticationState:
              stateRef.current.authenticationState === "loading"
                ? "line_authenticated"
                : stateRef.current.authenticationState,
          });

        } catch (error) {
          logger.warn("Failed to sync Firebase token", {
            error: error instanceof Error ? error.message : String(error),
            component: "useFirebaseAuthState",
          });
        }
      } else {
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
