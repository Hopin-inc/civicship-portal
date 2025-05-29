"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/auth/auth-service";
import { GqlCurrentUserPayload } from "@/types/graphql";

export const useUserData = (
  userData: { currentUser?: { user: GqlCurrentUserPayload["user"] } } | null | undefined,
  onCurrentUserChange: (user: GqlCurrentUserPayload["user"] | null) => void,
  onAuthStateChange: (state: string) => void
) => {
  const authService = AuthService.getInstance();

  useEffect(() => {
    if (userData?.currentUser?.user) {
      onCurrentUserChange(userData.currentUser.user);
      onAuthStateChange("user_registered");

      const updateUserRegistrationState = async () => {
        try {
          const timestamp = new Date().toISOString();
          console.log(`🔍 [${timestamp}] Updating user registration state in useEffect`);
          await authService.handleUserRegistrationSuccess();
          console.log(`🔍 [${timestamp}] User registration state updated successfully`);
        } catch (error) {
          console.error("Failed to update user registration state:", error);
        }
      };

      updateUserRegistrationState();
    }
  }, [userData, authService, onCurrentUserChange, onAuthStateChange]);
};
