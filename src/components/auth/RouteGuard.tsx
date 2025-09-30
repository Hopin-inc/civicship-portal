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
  const { 
    isAuthenticated, 
    authenticationState, 
    loading,
    initializationPhase,
    isInitializationComplete,
    initializationError,
  } = useAuth();
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
    if (!isInitializationComplete || initializationPhase !== "complete") {
      logger.debug("RouteGuard: Waiting for initialization completion", {
        component: "RouteGuard",
        pathname,
        initializationPhase,
        isInitializationComplete,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (initializationError) {
      logger.warn("RouteGuard: Initialization error detected, staying pending", {
        component: "RouteGuard",
        pathname,
        error: initializationError.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (loading || userLoading || isInitialRender) {
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
      if (redirectPath) {
        logger.debug("RouteGuard: Redirect decision made", {
          component: "RouteGuard",
          pathname,
          redirectPath,
          authenticationState,
          timestamp: new Date().toISOString(),
        });
        router.replace(redirectPath);
      } else {
        logger.debug("RouteGuard: Access allowed", {
          component: "RouteGuard",
          pathname,
          authenticationState,
          timestamp: new Date().toISOString(),
        });
      }
      setAuthorized(true);
    };
    authCheck();
    return () => {};
  }, [
    isInitializationComplete,
    initializationPhase,
    initializationError,
    pathname,
    authenticationState,
    loading,
    userLoading,
    router,
    authRedirectService,
    nextParam,
    searchParams,
    isInitialRender,
  ]);

  if (!isInitializationComplete || loading || userLoading || isInitialRender) {
    return <LoadingIndicator />;
  }

  return authorized ? <>{children}</> : null;
};
