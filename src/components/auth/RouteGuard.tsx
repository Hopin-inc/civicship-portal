"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { authenticationState, loading, isAuthenticating } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;

  const authRedirectService = React.useMemo(() => AuthRedirectService.getInstance(), []);

  useEffect(() => {
    if (loading || isAuthenticating) return;

    if (authenticationState === "loading" || authenticationState === "authenticating") {
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
        return;
      }
    }

    const pathWithParams = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
    const redirectPath = authRedirectService.getRedirectPath(
      pathWithParams as RawURIComponent,
      decodeURIComponentWithType(nextParam),
    );

    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [
    pathname,
    authenticationState,
    loading,
    router,
    authRedirectService,
    nextParam,
    searchParams,
  ]);

  return <>{children}</>;
};
