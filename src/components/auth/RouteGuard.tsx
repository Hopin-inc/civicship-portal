"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

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
  const { isAuthenticated, isPhoneVerified, isUserRegistered, authenticationState, isAuthenticating, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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

    const authCheck = () => {
      const next = window.location.pathname + window.location.search;
      const redirectPath = authRedirectService.getRedirectPath(pathname, next, isAuthenticating);

      if (redirectPath) {
        console.log(`🔄 [${new Date().toISOString()}] RouteGuard redirecting to: ${redirectPath}`);
        setAuthorized(false);
        router.replace(redirectPath);
      } else {
        setAuthorized(true);
      }
    };

    authCheck();

    return () => {};
  }, [pathname, authenticationState, isAuthenticating, loading, userLoading, router, authRedirectService]);

  if (loading || userLoading) {
    return <LoadingIndicator />;
  }

  return authorized ? <>{children}</> : null;
};
