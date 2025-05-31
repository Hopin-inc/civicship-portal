"use client";

import { useEffect } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";
import { GqlCurrentUserQuery } from "@/types/graphql";

interface UseUserRegistrationStateProps {
  authStateManager: AuthStateManager | null;
  userData: GqlCurrentUserQuery | undefined;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const useUserRegistrationState = ({ authStateManager, userData, setState }: UseUserRegistrationStateProps) => {
  useEffect(() => {
    if (userData?.currentUser?.user) {
      setState((prev) => ({
        ...prev,
        currentUser: userData.currentUser?.user,
        authenticationState: "user_registered",
      }));

      if (authStateManager) {
        const updateUserRegistrationState = async () => {
          try {
            const timestamp = new Date().toISOString();
            console.log(`🔍 [${timestamp}] Updating user registration state in useEffect`);
            await authStateManager.handleUserRegistrationStateChange(true);
            console.log(
              `🔍 [${timestamp}] AuthStateManager user registration state updated successfully`,
            );
          } catch (error) {
            console.error("Failed to update AuthStateManager user registration state:", error);
          }
        };

        updateUserRegistrationState();
      }
    }
  }, [userData, authStateManager, setState]);
};
