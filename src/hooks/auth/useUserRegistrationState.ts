"use client";

import { useEffect, useRef } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/types/auth";
import { GqlCurrentUserQuery } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseUserRegistrationStateProps {
  authStateManager: AuthStateManager | null;
  userData: GqlCurrentUserQuery | undefined;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useUserRegistrationState = ({
  authStateManager,
  userData,
  setState,
}: UseUserRegistrationStateProps) => {
  const processedUserIdRef = useRef<string | null>(null);
  const authStateManagerRef = useRef(authStateManager);
  authStateManagerRef.current = authStateManager;

  useEffect(() => {
    const currentAuthStateManager = authStateManagerRef.current;
    
    if (currentAuthStateManager && currentAuthStateManager.getState() === "initializing") {
      return;
    }

    if (userData?.currentUser?.user) {
      const userId = userData.currentUser.user.id;

      if (processedUserIdRef.current === userId) {
        return;
      }

      processedUserIdRef.current = userId;

      setState((prev) => ({
        ...prev,
        currentUser: userData.currentUser?.user,
        authenticationState: prev.authenticationState === "phone_authenticated" || prev.authenticationState === "line_authenticated" || prev.authenticationState === "initializing"
          ? "user_registered"
          : prev.authenticationState,
      }));

      if (currentAuthStateManager) {
        const updateUserRegistrationState = async () => {
          try {
            await currentAuthStateManager.handleUserRegistrationStateChange(true);
          } catch (error) {
            logger.error("Failed to update AuthStateManager user registration state", {
              error: error instanceof Error ? error.message : String(error),
              component: "useUserRegistrationState",
            });
          }
        };

        updateUserRegistrationState();
      }
    } else {
      processedUserIdRef.current = null;
    }
  }, [userData, setState, authStateManager]);
};
