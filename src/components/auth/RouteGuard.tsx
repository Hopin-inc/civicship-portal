"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const { isAuthenticated, authenticationState, loading, authInitComplete } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  const navKey = useMemo(
    () => `${pathname}?${searchParams?.toString() ?? ""}`,
    [pathname, searchParams]
  );

  const requireAuth = authRedirectService.isProtectedPath(pathname);

  const decision = useMemo<"pending" | "stay" | "redirect">(() => {
    if (!authInitComplete || loading || userLoading || isInitialRender) return "pending";
    if (!requireAuth) return "stay";
    return isAuthenticated ? "stay" : "redirect";
  }, [authInitComplete, loading, userLoading, isInitialRender, requireAuth, isAuthenticated]);

  const redirectingRef = useRef(false);
  const lastHandledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setIsInitialRender(false);
    }
  }, [loading]);

  useEffect(() => {
    if (decision !== "redirect") {
      redirectingRef.current = false;
      return;
    }
    if (redirectingRef.current) return;
    if (lastHandledKeyRef.current === navKey) return;

    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth = urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        logger.debug("RouteGuard: Skipping redirect for LINE auth return to homepage", {
          component: "RouteGuard",
        });
        return;
      }
    }

    redirectingRef.current = true;
    lastHandledKeyRef.current = navKey;

    const pathWithParams = (searchParams?.toString())
      ? `${pathname}?${searchParams!.toString()}` as RawURIComponent
      : pathname as RawURIComponent;

    const redirectPath = authRedirectService.getRedirectPath(
      pathWithParams,
      decodeURIComponentWithType(nextParam)
    );
    if (redirectPath) router.replace(redirectPath);
  }, [decision, navKey, pathname, searchParams, nextParam, router, authRedirectService]);

  if (decision === "pending") return <LoadingIndicator />;
  if (decision === "redirect") return null;
  
  return <>{children}</>;
};
