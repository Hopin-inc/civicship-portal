"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { AuthContextType, AuthProviderProps, SsrAuthSnapshot } from "@/types/auth";
import { initAuth } from "@/lib/auth/init";
import { useCurrentUserServerQuery } from "@/types/graphql";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";
import { applySsrAuthState } from "@/lib/auth/init/applySsrAuthState";
import { useAuthActions } from "@/hooks/auth/actions";
import { useAuthSideEffects } from "@/hooks/auth/sideEffects";
import { useAuthValue } from "@/hooks/auth/init/useAuthValue";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
}) => {
  const { liffService, phoneAuthService, authStateManager } = useAuthDependencies();
  const hasInitialized = useRef(false);

  const ssrSnapshot = useMemo<SsrAuthSnapshot>(
    () => ({
      hasUser: !!ssrCurrentUser,
      lineAuthenticated: !!ssrLineAuthenticated,
      phoneAuthenticated: !!ssrPhoneAuthenticated,
      userRegistered: !!ssrCurrentUser && !!ssrPhoneAuthenticated,
    }),
    [ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated],
  );

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!authStateManager) return;

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
  }, [authStateManager, liffService, ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated]);

  const { refetch } = useCurrentUserServerQuery({
    skip: Boolean(ssrCurrentUser),
    fetchPolicy: "network-only",
  });

  const refetchUser = useCallback(async () => {
    const { data } = await refetch();
    return data?.currentUser?.user ?? null;
  }, [refetch]);

  useAuthSideEffects({ authStateManager, liffService, refetchUser });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  const actions = React.useMemo(
    () => ({ logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification }),
    [logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification],
  );

  const value = useAuthValue({ refetchUser, phoneAuthService, actions });

  const contextValue = useMemo(() => ({ ...value, ssrSnapshot }), [value, ssrSnapshot]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
