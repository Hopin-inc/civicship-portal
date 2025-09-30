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
  enabled?: boolean;
}

export const useUserRegistrationState = ({
  authStateManager,
  userData,
  setState,
  enabled = true,
}: UseUserRegistrationStateProps) => {
  const processedUserIdRef = useRef<string | null>(null);
  const authStateManagerRef = useRef(authStateManager);
  authStateManagerRef.current = authStateManager;

  useEffect(() => {
    if (!enabled) return;
    
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
  }, [userData, setState]);
};
