"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";

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
  const { isAuthenticated, authenticationState, loading, authReady } = useAuth();
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
    console.log("🛡️ RouteGuard: useEffect triggered", {
      loading,
      userLoading,
      isInitialRender,
      authReady,
      authenticationState,
      isAuthenticated,
    });
    
    if (loading || userLoading || isInitialRender || !authReady) {
      console.log("🛡️ RouteGuard: Skipping redirect check - not ready", {
        loading,
        userLoading,
        isInitialRender,
        authReady,
      });
      return;
    }

    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth =
        urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        logger.debug("RouteGuard: Skipping redirect for LINE auth return to homepage", {
          component: "RouteGuard",
        });
        setAuthorized(true);
        return;
      }
    }

    const authCheck = () => {
      const pathNameWithParams =
        searchParams.size > 0
          ? (`${pathname}?${searchParams.toString()}` as RawURIComponent)
          : (pathname as RawURIComponent);
      const redirectPath = authRedirectService.getRedirectPath(
        pathNameWithParams,
        decodeURIComponentWithType(nextParam),
      );
      
      console.log("🛡️ RouteGuard: Redirect check", {
        pathname,
        pathNameWithParams,
        redirectPath,
        authenticationState,
        isAuthenticated,
        willRedirect: !!redirectPath,
      });
      
      if (redirectPath) {
        console.log("🛡️ RouteGuard: Performing redirect", {
          from: pathNameWithParams,
          to: redirectPath,
          authenticationState,
          isAuthenticated,
        });
        router.replace(redirectPath);
      }
      setAuthorized(true);
    };
    authCheck();
    return () => {};
  }, [
    pathname,
    authenticationState,
    loading,
    userLoading,
    router,
    authRedirectService,
    nextParam,
    searchParams,
    isInitialRender,
    authReady,
  ]);

  if (loading || userLoading || isInitialRender || !authReady || authenticationState === "network_error" || authenticationState === "verifying") {
    return <LoadingIndicator />;
  }

  return authorized ? <>{children}</> : null;
};
