"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";
import { isAuthRequiredForPath } from "@/config/auth-config";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/environment-detector";

/**
 * ルートガードコンポーネントのプロパティ
 */
interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * ルートガードコンポーネント
 * 認証状態に基づいてページアクセスを制御する
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, authenticationState, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;
  const [authorized, setAuthorized] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // LIFF環境の判定 - 不整合を防ぐためにメモ化
  const environment = React.useMemo(() => {
    const env = detectEnvironment();
    console.debug("RouteGuard: 環境検出", { env, pathname });
    return env;
  }, [pathname]); // pathnameが変更された時に再検出
  const isLiffEnvironment = environment === AuthEnvironment.LIFF;

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  // 現在のページが認証不要かどうかを判定
  const isAuthNotRequired = !isAuthRequiredForPath(pathname);

  useEffect(() => {
    if (!loading) {
      setIsInitialRender(false);
    }
  }, [loading]);

  useEffect(() => {
    // LIFF環境で認証状態がloadingの場合は、自動ログインの完了を待つ
    if (isLiffEnvironment && authenticationState === "loading") {
      logger.debug("RouteGuard: Waiting for auto-login completion in LIFF environment", {
        authenticationState,
        environment,
        component: "RouteGuard",
      });
      return;
    }
    
    if (loading || userLoading || isInitialRender) {
      return;
    }

    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth = urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        logger.debug("RouteGuard: Skipping redirect for LINE auth return to homepage", {
          component: "RouteGuard",
        });
        setAuthorized(true);
        return;
      }
    }

    const authCheck = () => {
      const pathNameWithParams = searchParams.size > 0
        ? `${ pathname }?${ searchParams.toString() }` as RawURIComponent
        : pathname as RawURIComponent;
      
      logger.debug("RouteGuard: About to call getRedirectPath", {
        pathname: pathNameWithParams,
        authenticationState,
        isLiffEnvironment,
        component: "RouteGuard",
      });
      
      const redirectPath = authRedirectService.getRedirectPath(pathNameWithParams, decodeURIComponentWithType(nextParam));
      
      logger.debug("RouteGuard: getRedirectPath result", {
        pathname: pathNameWithParams,
        redirectPath,
        willRedirect: !!redirectPath,
        component: "RouteGuard",
      });
      
      if (redirectPath) {
        logger.debug("RouteGuard: Executing redirect", {
          from: pathNameWithParams,
          to: redirectPath,
          component: "RouteGuard",
        });
        router.replace(redirectPath);
      }
      setAuthorized(true);
    };
    authCheck();
    return () => {
    };
  }, [pathname, authenticationState, loading, userLoading, router, authRedirectService, nextParam, searchParams, isInitialRender]);

  // 認証不要ページの場合は即座にコンテンツを表示（ローディングを表示しない）
  if (isAuthNotRequired) {
    return <>{ children }</>;
  }

  // 認証が必要なページの場合のみローディングを表示
  if (loading || userLoading || isInitialRender || (isLiffEnvironment && authenticationState === "loading")) {
    return <LoadingIndicator />;
  }

  return authorized ? <>{ children }</> : null;
};
