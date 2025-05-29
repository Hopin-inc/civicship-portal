"use client";

import { useEffect } from "react";
import { AuthService } from "@/lib/auth/auth-service";
import { GqlCurrentUserPayload } from "@/types/graphql";
import { AuthenticationState } from "@/lib/auth/auth-state-store";

export const useUserData = (
  userData: { currentUser?: { user: GqlCurrentUserPayload["user"] } } | null | undefined,
  onCurrentUserChange: (user: GqlCurrentUserPayload["user"] | null) => void,
  onAuthStateChange: (state: AuthenticationState) => void,
  phoneAuthState: { isVerified: boolean }
) => {
  const authService = AuthService.getInstance();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] Updating user registration state in useEffect - isVerified: ${phoneAuthState.isVerified}`);
    
    if (userData?.currentUser?.user) {
      console.log(`🔍 [${timestamp}] User data found, updating state`);
      onCurrentUserChange(userData.currentUser.user);
      
      if (phoneAuthState.isVerified) {
        console.log(`🔍 [${timestamp}] Phone verified, updating auth state to user_registered`);
        authService.handleUserRegistrationSuccess();
        onAuthStateChange("user_registered");
        console.log(`🔍 [${timestamp}] User registration state updated successfully`);
      } else {
        console.log(`⚠️ [${timestamp}] User data found but phone not verified`);
      }
    } else {
      console.log(`⚠️ [${timestamp}] No user data available yet`);
    }
  }, [userData, phoneAuthState.isVerified, authService, onCurrentUserChange, onAuthStateChange]);
};
