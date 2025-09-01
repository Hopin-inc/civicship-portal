"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent, matchPaths } from "@/utils/path";

const AUTHENTICATION_FREE_PATHS = [
  '/opportunities',
  '/opportunities/*',
];

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

    if (matchPaths(pathname, ...AUTHENTICATION_FREE_PATHS)) {
      logger.debug("RouteGuard: Skipping authentication for authentication-free path", {
        pathname,
        matchedPaths: AUTHENTICATION_FREE_PATHS,
        component: "RouteGuard",
      });
      setAuthorized(true);
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
    return <LoadingIndicator />;
  }

  return authorized ? <>{ children }</> : null;
};
