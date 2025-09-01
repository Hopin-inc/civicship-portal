"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";
import { isNoAuthPath } from "@/lib/communities/metadata";

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
  const { authenticationState, isAuthenticating } = useAuthStore();
  const isAuthenticated = authenticationState === "user_registered";
  const loading = isAuthenticating;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;
  const [authorized, setAuthorized] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  // 認証が不要なページかどうかを判定
  const isNoAuthRequired = isNoAuthPath(pathname);

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    if (!loading) {
      setIsInitialRender(false);
    }
  }, [loading]);

  useEffect(() => {
    // 認証が不要なページの場合は、ローディングを待たずに先に描画を開始
    if (isNoAuthRequired) {
      setAuthorized(true);
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
      const redirectPath = authRedirectService.getRedirectPath(pathNameWithParams, decodeURIComponentWithType(nextParam));
      if (redirectPath) {
        router.replace(redirectPath);
      }
      setAuthorized(true);
    };
    authCheck();
    return () => {
    };
  }, [pathname, authenticationState, loading, userLoading, router, authRedirectService, nextParam, searchParams, isInitialRender, isNoAuthRequired]);

  // 認証が不要なページの場合は、ローディングを待たずに先に描画を開始
  if (isNoAuthRequired) {
    return <>{ children }</>;
  }

  if (loading || userLoading || isInitialRender) {
    return <LoadingIndicator />;
  }

  return authorized ? <>{ children }</> : null;
};
