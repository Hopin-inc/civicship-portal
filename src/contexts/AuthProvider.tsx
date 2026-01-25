"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
import { initAuth } from "@/lib/auth/init";
import { useCurrentUserServerQuery } from "@/types/graphql";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";
import { applySsrAuthState } from "@/lib/auth/init/applySsrAuthState";
import { useAuthActions } from "@/hooks/auth/actions";
import { useAuthSideEffects } from "@/hooks/auth/sideEffects";
import { useAuthValue } from "@/hooks/auth/init/useAuthValue";
import { useLanguageSync } from "@/hooks/useLanguageSync";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
}) => {
  const { liffService, phoneAuthService, authStateManager } = useAuthDependencies();
  const hasInitialized = useRef(false);
  const hasFullAuth = Boolean(ssrCurrentUser && ssrLineAuthenticated && ssrPhoneAuthenticated);

  useEffect(() => {
    // Only skip if already initialized AND authStateManager is available
    // This ensures we don't skip initialization when authStateManager becomes available after hydration
    if (!authStateManager) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // ✅ SSR初期状態適用
    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    // 🚀 通常の初期化
    void initAuth({
      liffService,
      authStateManager,
      ssrCurrentUser,
      ssrLineAuthenticated,
      ssrPhoneAuthenticated,
    });
  }, [authStateManager, liffService, ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated, hasFullAuth]);

  const { refetch } = useCurrentUserServerQuery({
    skip: Boolean(ssrCurrentUser),
    fetchPolicy: "network-only",
  });

  const refetchUser = useCallback(async () => {
    console.log("[AuthProvider] refetchUser: starting refetch");
    try {
      const result = await refetch();
      console.log("[AuthProvider] refetchUser: refetch completed", {
        hasData: !!result.data,
        hasUser: !!result.data?.currentUser?.user,
        userId: result.data?.currentUser?.user?.id,
        error: result.error?.message,
      });
      return result.data?.currentUser?.user ?? null;
    } catch (error) {
      console.error("[AuthProvider] refetchUser: refetch failed", {
        error: (error as Error).message,
      });
      return null;
    }
  }, [refetch]);

  useAuthSideEffects({ authStateManager, liffService, refetchUser, hasFullAuth });

  const { logout, loginWithLiff } = useAuthActions({
    liffService,
    phoneAuthService,
    authStateManager,
  });
  const actions = React.useMemo(() => ({ logout, loginWithLiff }), [logout, loginWithLiff]);

  const value = useAuthValue({ refetchUser, actions });

  // Sync browser language preference to server on first visit
  useLanguageSync({ user: value.user, loading: value.loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
