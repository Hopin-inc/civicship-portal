"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/auth/auth-service";
import { GqlCurrentUserPayload } from "@/types/graphql";
import { AuthenticationState } from "@/lib/auth/auth-state-store";

export const useUserData = (
  userData: { currentUser?: { user: GqlCurrentUserPayload["user"] } } | null | undefined,
  onCurrentUserChange: (user: GqlCurrentUserPayload["user"] | null) => void,
  onAuthStateChange: (state: AuthenticationState) => void
) => {
  const authService = AuthService.getInstance();

  useEffect(() => {
    const hookTimestamp = new Date().toISOString();
    console.log(`🔄 [${hookTimestamp}] useUserData hook effect triggered with userData:`, {
      hasUserData: !!userData,
      hasCurrentUser: !!userData?.currentUser,
      hasUser: !!userData?.currentUser?.user,
      userId: userData?.currentUser?.user?.id || 'none'
    });

    if (userData?.currentUser) {
      console.log(`🔄 [${hookTimestamp}] Setting currentUser and updating auth state to user_registered`);
      onCurrentUserChange(userData.currentUser.user);
      onAuthStateChange("user_registered");

      const updateUserRegistrationState = async () => {
        const fnTimestamp = new Date().toISOString();
        console.log(`👀 [${fnTimestamp}] updateUserRegistrationState started!`);
        try {
          console.log(`🔍 [${fnTimestamp}] Updating user registration state in useEffect`);
          await authService.handleUserRegistrationSuccess();
          console.log(`🔍 [${fnTimestamp}] User registration state updated successfully`);
        } catch (error) {
          console.error(`❌ [${fnTimestamp}] Failed to update user registration state:`, error);
        }
      };

      updateUserRegistrationState();
    } else {
      console.log(`🔄 [${hookTimestamp}] No user data available, not updating currentUser or auth state`);
    }
  }, [userData, authService, onCurrentUserChange, onAuthStateChange]);
};
