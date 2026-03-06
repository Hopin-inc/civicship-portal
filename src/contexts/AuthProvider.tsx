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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
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
      environment: typeof window !== "undefined" ? liffService.getState() : "SSR",
    });

    // ✅ SSR初期状態適用
    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    // 🚀 通常の初期化
    void initAuth({
      communityConfig,
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

  // auth:token-expired イベントをキャッチしてセッションをクリアし、LIFF 再認証を行う
  useEffect(() => {
    if (typeof window === "undefined") return;
    let isHandling = false;

    const handleTokenExpired = async (event: Event) => {
      if (isHandling) return;
      isHandling = true;
      try {
        logger.warn("[AuthProvider] Stale session detected — clearing and re-authenticating", {
          detail: (event as CustomEvent).detail,
        });
        try {
          await fetch("/api/sessionLogout", { method: "POST" });
        } catch (e) {
          logger.warn("[AuthProvider] Failed to clear session cookie", { error: e });
        }
        if (authStateManager) {
          hasInitialized.current = false;
          await initAuth({
            communityConfig,
            liffService,
            authStateManager,
            ssrCurrentUser: null,
            ssrLineAuthenticated: false,
            ssrPhoneAuthenticated: false,
          });
        }
      } finally {
        isHandling = false;
      }
    };

    window.addEventListener("auth:token-expired", handleTokenExpired);
    return () => window.removeEventListener("auth:token-expired", handleTokenExpired);
  }, [authStateManager, communityConfig, liffService]);

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
