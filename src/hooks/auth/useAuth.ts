"use client";

import { useAuthStore } from "@/lib/auth/state-store";
import { ENABLE_AUTH_V2 } from "@/lib/auth/auth-flags";

export const useAuth = () => {
  const store = useAuthStore();
  
  if (!ENABLE_AUTH_V2) {
    return {
      authenticationState: "loading" as const,
      isAuthenticating: false,
      firebaseUser: null,
      currentUser: null,
      environment: "web" as const,
      isV2Enabled: false,
    };
  }

  return {
    authenticationState: store.authenticationState,
    isAuthenticating: store.isAuthenticating,
    firebaseUser: store.firebaseUser,
    currentUser: store.currentUser,
    environment: store.environment,
    isV2Enabled: true,
    setAuthState: store.setAuthState,
    reset: store.reset,
  };
};
