"use client";

import { useEffect, useRef } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";
import { GqlCurrentUserQuery } from "@/types/graphql";
import clientLogger from "@/lib/logging/client";

interface UseUserRegistrationStateProps {
  authStateManager: AuthStateManager | null;
  userData: GqlCurrentUserQuery | undefined;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useUserRegistrationState = ({ authStateManager, userData, setState }: UseUserRegistrationStateProps) => {
  const processedUserIdRef = useRef<string | null>(null);
  const authStateManagerRef = useRef(authStateManager);
  authStateManagerRef.current = authStateManager;

  useEffect(() => {
    clientLogger.debug("useUserRegistrationState fired", {
      component: "useUserRegistrationState"
    });
    
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
            const timestamp = new Date().toISOString();
            clientLogger.debug("Updating user registration state in useEffect", {
              timestamp,
              component: "useUserRegistrationState"
            });
            await currentAuthStateManager.handleUserRegistrationStateChange(true);
            clientLogger.debug("AuthStateManager user registration state updated successfully", {
              timestamp,
              component: "useUserRegistrationState"
            });
          } catch (error) {
            clientLogger.error("Failed to update AuthStateManager user registration state", {
              error: error instanceof Error ? error.message : String(error),
              component: "useUserRegistrationState"
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
