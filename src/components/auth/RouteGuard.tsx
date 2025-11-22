"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { logger } from "@/lib/logging";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { loading } = useAuth();
  const authState = useAuthStore((s) => s.state);
  const currentUser = useAuthStore((s) => s.state.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;

  const authRedirectService = React.useMemo(() => AuthRedirectService.getInstance(), []);
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const redirectedRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (authState.isAuthenticating || authState.isAuthInProgress) {
      setIsReadyToRender(false);
      return;
    }

    if (["loading", "authenticating"].includes(authState.authenticationState)) {
      setIsReadyToRender(false);
      return;
    }

    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth =
        urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        setIsReadyToRender(false);
        return;
      }
    }

    const pathWithParams = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
    
    const redirectPath = authRedirectService.getRedirectPath(
      pathWithParams as RawURIComponent,
      decodeURIComponentWithType(nextParam),
      currentUser,
    );

    logger.info("[LIFF-DEBUG] RouteGuard redirect check", {
      pathname,
      pathWithParams,
      authenticationState: authState.authenticationState,
      currentUser: !!currentUser,
      currentUserId: currentUser?.id,
      redirectPath,
      willRedirect: !!(redirectPath && redirectPath !== pathWithParams),
    });

    if (redirectPath && redirectPath !== pathWithParams) {
      if (redirectedRef.current !== redirectPath) {
        redirectedRef.current = redirectPath;
        setIsReadyToRender(false);
        router.replace(redirectPath);
      }
    } else {
      redirectedRef.current = null;
      setIsReadyToRender(true);
    }
  }, [pathname, authState, currentUser, loading, router, authRedirectService, nextParam, searchParams]);

  // --- 未確定中は描画しない（チラつき防止） ---
  if (!isReadyToRender) {
    return <LoadingIndicator />; // or return null;
  }

  return <>{children}</>;
};
