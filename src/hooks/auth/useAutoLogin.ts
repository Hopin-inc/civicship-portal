"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { AuthState } from "@/contexts/AuthProvider";
import { LiffService } from "@/lib/auth/liff-service";
import { logger } from "@/lib/logging";
import { useAuthPathCheck } from "./useAuthPathCheck";
import { GqlCurrentUserQuery } from "@/types/graphql";

interface UseAutoLoginProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
  userData: GqlCurrentUserQuery | undefined;
  // 特定のページでのみ自動ログインを実行するための設定
  authRequiredPaths?: string[];
}

const useAutoLogin = ({
  environment,
  state,
  liffService,
  setState,
  refetchUser,
  userData,
  authRequiredPaths = [],
}: UseAutoLoginProps) => {
  const { isAuthRequired } = useAuthPathCheck(authRequiredPaths);
  const attemptedRef = useRef(false);

  // 自動ログインの条件をメモ化
  const shouldAutoLogin = useMemo(() => {
    if (environment !== AuthEnvironment.LIFF) return false;
    if (!isAuthRequired) return false;
    
    const liffState = liffService.getState();
    return (
      state.authenticationState === "unauthenticated" &&
      !state.isAuthenticating &&
      !attemptedRef.current &&
      liffState.isInitialized &&
      liffState.isLoggedIn
    );
  }, [
    environment,
    isAuthRequired,
    state.authenticationState,
    state.isAuthenticating,
    liffService,
  ]);

  // 自動ログイン処理をメモ化
  const handleAutoLogin = useCallback(async () => {
    if (attemptedRef.current) return;
    
    attemptedRef.current = true;
    const timestamp = new Date().toISOString();

    setState((prev) => ({ ...prev, isAuthenticating: true }));
    
    try {
      // Firebase認証とユーザーデータ取得を条件付き並列実行
      const [authResult] = await Promise.allSettled([
        liffService.signInWithLiffToken(),
        // 既存ユーザーデータがない場合のみrefetchを並列実行
        !userData?.currentUser ? refetchUser() : Promise.resolve()
      ]);

      if (authResult.status === 'fulfilled' && authResult.value) {
        // 認証成功時の処理
        logger.debug("Auto-login successful", {
          component: "useAutoLogin",
          timestamp,
        });
      } else if (authResult.status === 'rejected') {
        // 認証失敗時の処理
        logger.info("Auto-login with LIFF failed", {
          authType: "liff",
          error: authResult.reason instanceof Error ? authResult.reason.message : String(authResult.reason),
          component: "useAutoLogin",
        });
      }
    } catch (error) {
      logger.info("Auto-login with LIFF failed", {
        authType: "liff",
        error: error instanceof Error ? error.message : String(error),
        component: "useAutoLogin",
      });
    } finally {
      setState((prev) => ({ ...prev, isAuthenticating: false }));
    }
  }, [liffService, setState, refetchUser, userData]);

  // 自動ログインの実行
  useEffect(() => {
    if (shouldAutoLogin) {
      handleAutoLogin();
    }
  }, [shouldAutoLogin, handleAutoLogin]);

  // 認証状態が変わったらリセット
  useEffect(() => {
    if (state.authenticationState !== "unauthenticated") {
      attemptedRef.current = false;
    }
  }, [state.authenticationState]);
};

export default useAutoLogin;
