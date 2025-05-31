"use client";

import { useEffect, useRef } from "react";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState } from "@/contexts/AuthProvider";
import { GqlCurrentUserQuery } from "@/types/graphql";

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
    console.log("[Debug] 🔥 useUserRegistrationState fired.");
    
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
            console.log(`🔍 [${timestamp}] Updating user registration state in useEffect`);
            await currentAuthStateManager.handleUserRegistrationStateChange(true);
            console.log(
              `🔍 [${timestamp}] AuthStateManager user registration state updated successfully`,
            );
          } catch (error) {
            console.error("Failed to update AuthStateManager user registration state:", error);
          }
        };

        updateUserRegistrationState();
      }
    } else {
      processedUserIdRef.current = null;
    }
  }, [userData, setState]);
};
