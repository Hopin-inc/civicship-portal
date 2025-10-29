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
import { useAuthStore } from "@/lib/auth/core/auth-store";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
}) => {
  const { liffService, phoneAuthService, authStateManager } = useAuthDependencies();
  const hasInitialized = useRef(false);
  const prehydratedRef = useRef(false);

  if (!prehydratedRef.current && ssrCurrentUser && ssrLineAuthenticated) {
    const store = useAuthStore.getState();
    if (store.state.authenticationState === "loading") {
      const targetState = ssrPhoneAuthenticated ? "user_registered" : "line_authenticated";
      store.setState({
        authenticationState: targetState,
        currentUser: ssrCurrentUser,
        isAuthenticating: false,
        isAuthInProgress: false,
      });
      prehydratedRef.current = true;
    }
  }

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!authStateManager) return;

    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
