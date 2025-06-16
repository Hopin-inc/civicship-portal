"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";

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
  const nextParam = searchParams.get("next");
  const [authorized, setAuthorized] = useState(false);

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    if (loading || userLoading) {
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
        ? `${ pathname }?${ searchParams.entries().map(([k, v]) => `${ k }=${ v }`).toArray().join("&") }`
        : pathname;
      const redirectPath = authRedirectService.getRedirectPath(pathNameWithParams, nextParam);
      if (redirectPath) {
        setAuthorized(false);
        router.replace(redirectPath);
      } else {
        setAuthorized(true);
      }
    };
    authCheck();
    return () => {
    };
  }, [pathname, authenticationState, loading, userLoading, router, authRedirectService, nextParam, searchParams]);

  if (loading || userLoading) {
    return <LoadingIndicator />;
  }

  // return authorized ? <>{ children }</> : null;
  return <>{ children }</>;
};
