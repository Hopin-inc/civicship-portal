"use client";

import { useAuthStore, setGlobalAuthState, resetGlobalAuthState } from "@/lib/auth/state-store";
import { ENABLE_AUTH_V2 } from "@/lib/auth/auth-flags";

export function useAuth() {
  const store = useAuthStore();

  if (!ENABLE_AUTH_V2) {
    return {
      ...store,
      isV2Enabled: false,
    };
  }

  return {
    ...store,
    isV2Enabled: true,
    setAuthState: setGlobalAuthState,
    reset: resetGlobalAuthState,
  };
}
