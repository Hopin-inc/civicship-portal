"use client";

import { useEffect, useRef } from "react";
import { lineAuth } from "@/lib/auth/firebase-config";
import { TokenManager } from "@/lib/auth/token-manager";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthState } from "@/contexts/AuthProvider";
import { GqlCurrentUserQuery } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseConsolidatedAuthStateProps {
  authStateManager: AuthStateManager | null;
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  phoneAuthService: PhoneAuthService;
  userData: GqlCurrentUserQuery | undefined;
  refetchUser: () => void;
}

export const useConsolidatedAuthState = ({
  authStateManager,
  state,
  setState,
  phoneAuthService,
  userData,
  refetchUser,
}: UseConsolidatedAuthStateProps) => {
  const processedUserIdRef = useRef<string | null>(null);
  const authStateManagerRef = useRef(authStateManager);
  const stateRef = useRef(state);
  
  authStateManagerRef.current = authStateManager;
  stateRef.current = state;

  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      setState((prev) => {
        const newState = {
          ...prev,
          firebaseUser: user,
        };

        if (!prev.isAuthenticating) {
          newState.authenticationState = user
            ? prev.authenticationState === "loading"
              ? "line_authenticated"
              : prev.authenticationState
            : "unauthenticated";
        }

        return newState;
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
            component: "useConsolidatedAuthState",
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

  useEffect(() => {
    if (userData?.currentUser?.user) {
      const userId = userData.currentUser.user.id;

      if (processedUserIdRef.current === userId) {
        return;
      }

      processedUserIdRef.current = userId;

      setState((prev) => ({
        ...prev,
        currentUser: userData.currentUser?.user,
        authenticationState: "user_registered",
      }));

      const currentAuthStateManager = authStateManagerRef.current;
      if (currentAuthStateManager) {
        currentAuthStateManager.handleUserRegistrationStateChange(true);
      }
    } else {
      processedUserIdRef.current = null;
    }
  }, [userData, setState]);

  useEffect(() => {
    const currentAuthStateManager = authStateManagerRef.current;

    if (!currentAuthStateManager) return;

    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          await currentAuthStateManager.handlePhoneAuthStateChange(true);
        } catch (error) {
          logger.error("Failed to update AuthStateManager phone state in useEffect", {
            error: error instanceof Error ? error.message : String(error),
            component: "useConsolidatedAuthState"
          });
        }
      };

      updatePhoneAuthState();
    }

    setState((prev) => ({
      ...prev,
      authenticationState: isVerified
        ? prev.authenticationState === "line_authenticated"
          ? "phone_authenticated"
          : prev.authenticationState
        : prev.authenticationState,
    }));
  }, [setState, phoneAuthService]);
};
