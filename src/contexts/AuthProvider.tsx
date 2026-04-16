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
import { logger } from "@/lib/logging";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useAuthStore } from "@/lib/auth/core/auth-store";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
  ssrLineIdToken,
  ssrLineTokenExpiresAt,
}) => {
  const communityConfig = useCommunityConfig();
  const { liffService, phoneAuthService, authStateManager } = useAuthDependencies(communityConfig);
  const hasInitialized = useRef(false);
  const hasFullAuth = Boolean(ssrCurrentUser && ssrLineAuthenticated && ssrPhoneAuthenticated);

  useEffect(() => {
    // Only skip if already initialized AND authStateManager is available
    // This ensures we don't skip initialization when authStateManager becomes available after hydration
    if (!authStateManager) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    logger.debug("[AUTH] AuthProvider initialization", {
      hasFullAuth,
      ssrCurrentUser: !!ssrCurrentUser,
      ssrCurrentUserId: ssrCurrentUser?.id,
      ssrLineAuthenticated,
      ssrPhoneAuthenticated,
      hasSsrLineIdToken: !!ssrLineIdToken,
      environment: typeof window !== "undefined" ? liffService.getState() : "SSR",
    });

    // ✅ SSR初期状態適用
    applySsrAuthState(
      ssrCurrentUser,
      ssrLineAuthenticated,
      ssrPhoneAuthenticated,
      ssrLineIdToken,
      ssrLineTokenExpiresAt,
    );

    // 🚀 通常の初期化
    void initAuth({
      communityConfig,
      liffService,
      authStateManager,
      ssrCurrentUser,
      ssrLineAuthenticated,
      ssrPhoneAuthenticated,
    });
  }, [
    authStateManager,
    liffService,
    ssrCurrentUser,
    ssrLineAuthenticated,
    ssrPhoneAuthenticated,
    ssrLineIdToken,
    ssrLineTokenExpiresAt,
  ]);

  // 認証が完了するまでクエリの自動発火を抑制する。
  // loading/authenticating 中に発火すると Bearer トークンなしの匿名リクエストになり、
  // Apollo の正規化キャッシュに currentUser: null が書き込まれて
  // ClientLayout 等の後続クエリ結果を汚染する。
  const authenticationState = useAuthStore((s) => s.state.authenticationState);
  const shouldSkipQuery = Boolean(ssrCurrentUser)
    || authenticationState === "loading"
    || authenticationState === "authenticating";

  const { refetch } = useCurrentUserServerQuery({
    skip: shouldSkipQuery,
    fetchPolicy: "network-only",
  });

  const refetchUser = useCallback(async () => {
    const { data } = await refetch();
    return data?.currentUser?.user ?? null;
  }, [refetch]);

  useAuthSideEffects({ authStateManager, liffService, refetchUser, hasFullAuth });

  const { logout } = useAuthActions({
    liffService,
    phoneAuthService,
  });
  const actions = React.useMemo(() => ({ logout }), [logout]);

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
