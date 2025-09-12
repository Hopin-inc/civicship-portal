"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";
import { isProtectedPath } from "@/utils/path-guards";

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
  const pathname = usePathname();
  
  // 保護されたパスかどうかを判定（認証が必要なページ）
  const isProtected = useMemo(() => isProtectedPath(pathname), [pathname]);

  // 保護されていないページの場合は、認証関連のフックを一切実行せずに直接描画
  if (!isProtected) {
    return <>{ children }</>;
  }

  // 保護されたページの場合のみ認証処理を実行
  return <AuthenticatedRouteGuard>{children}</AuthenticatedRouteGuard>;
};

// 認証が必要なページ用のガードコンポーネント
const AuthenticatedRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authenticationState, loading, isLiffInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;
  const [authorized, setAuthorized] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsInitialRender(false);
    }
  }, [loading]);

  useEffect(() => {
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
      const redirectPath = authRedirectService.getRedirectPath(pathNameWithParams, decodeURIComponentWithType(nextParam));
      if (redirectPath) {
        router.replace(redirectPath);
      }
      setAuthorized(true);
    };
    authCheck();
    return () => {
    };
  }, [pathname, authenticationState, loading, userLoading, router, authRedirectService, nextParam, searchParams, isInitialRender]);

  if (loading || userLoading || isInitialRender) {
    return (
      <LoadingIndicator 
        authenticationState={authenticationState}
        isLiffInitialized={isLiffInitialized}
      />
    );
  }

  return authorized ? <>{ children }</> : null;
};
