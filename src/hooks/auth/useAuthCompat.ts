/**
 * Compatibility layer for gradual migration from useAuth() to useAuthStore()
 * 
 * This hook provides the same API as the old useAuth() hook but uses the new
 * Zustand store under the hood. This allows us to migrate files incrementally
 * without breaking existing functionality.
 * 
 * Usage:
 * // Old code:
 * import { useAuth } from "@/contexts/AuthProvider";
 * const { user, isAuthenticated, logout } = useAuth();
 * 
 * // New code (drop-in replacement):
 * import { useAuthCompat as useAuth } from "@/hooks/auth/useAuthCompat";
 * const { user, isAuthenticated, logout } = useAuth();
 */

import { useAuthStore } from "@/lib/auth/core/auth-store";
import { GqlUser, GqlCurrentPrefecture } from "@/types/graphql";
import { User as FirebaseUser } from "firebase/auth";
import { RawURIComponent } from "@/utils/path";

export interface UseAuthCompatReturn {
  user: GqlUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  authenticationState: "loading" | "unauthenticated" | "line_authenticated" | "phone_authenticated" | "user_registered";
  
  logout: () => Promise<void>;
  refetchUser: () => Promise<GqlUser | null>;
  
  phoneAuth: {
    isVerifying: boolean;
    phoneUid: string | null;
    phoneNumber: string | null;
  };
  
}

export const useAuthCompat = (): UseAuthCompatReturn => {
  const user = useAuthStore((s) => s.state.currentUser);
  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);
  const authenticationState = useAuthStore((s) => s.state.authenticationState);
  const phoneAuth = useAuthStore((s) => s.phoneAuth);
  const actions = useAuthStore((s) => s.actions);

  const isAuthenticated = authenticationState === "user_registered";
  const loading = authenticationState === "loading";

  const logout = actions?.logout ?? (async () => {});
  const refetchUser = actions?.refetchUser ?? (async () => null);

  return {
    user,
    firebaseUser,
    isAuthenticated,
    loading,
    authenticationState,
    logout,
    refetchUser,
    phoneAuth: {
      isVerifying: phoneAuth.isVerifying,
      phoneUid: phoneAuth.phoneUid,
      phoneNumber: phoneAuth.phoneNumber,
    },
  };
};
