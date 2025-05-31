"use client";

import { useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";

interface UseFirebaseAuthStateProps {
  authStateManager: AuthStateManager | null;
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useFirebaseAuthState = ({ authStateManager, state, setState }: UseFirebaseAuthStateProps) => {
  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);
  
  authStateManagerRef.current = authStateManager;
  stateRef.current = state;

  useEffect(() => {
    console.log("[Debug] 🔥 useFirebaseAuthState fired.");
    
    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
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
          const idToken = await user.getIdToken();
          const refreshToken = user.refreshToken;
          const tokenResult = await user.getIdTokenResult();
          const expirationTime = new Date(tokenResult.expirationTime).getTime();

          TokenManager.saveLineTokens({
            accessToken: idToken,
            refreshToken: refreshToken,
            expiresAt: expirationTime,
          });

          console.log('🔄 Firebase Auth token synced to cookies');
        } catch (error) {
          console.error('Failed to sync Firebase token to cookies:', error);
        }
      } else {
        TokenManager.clearLineTokens();
        console.log('🔄 LINE tokens cleared from cookies');
      }

      const currentAuthStateManager = authStateManagerRef.current;
      const currentState = stateRef.current;
      if (currentAuthStateManager && !currentState.isAuthenticating) {
        currentAuthStateManager.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [setState]);
};
