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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") as EncodedURIComponent;

  const authRedirectService = React.useMemo(() => AuthRedirectService.getInstance(), []);
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  const redirectedRef = React.useRef<string | null>(null);
  const effectRunCountRef = React.useRef(0);

  useEffect(() => {
    const effectRunId = ++effectRunCountRef.current;
    const flowId = `routeguard-${Date.now()}-${effectRunId}`;
    
    logger.debug("[RouteGuard] Effect triggered", {
      flowId,
      effectRunId,
      pathname,
      nextParam,
      authState: authState.authenticationState,
      isAuthInProgress: authState.isAuthInProgress,
      isAuthenticating: authState.isAuthenticating
    });

    if (authState.isAuthenticating || authState.isAuthInProgress) {
      logger.debug("[RouteGuard] Gated by isAuthenticating/isAuthInProgress", { 
        flowId,
        isAuthenticating: authState.isAuthenticating,
        isAuthInProgress: authState.isAuthInProgress
      });
      setIsReadyToRender(false);
      return;
    }

    if (["loading", "authenticating"].includes(authState.authenticationState)) {
      logger.debug("[RouteGuard] Gated by loading/authenticating state", { 
        flowId,
        state: authState.authenticationState
      });
      setIsReadyToRender(false);
      return;
    }

    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth =
        urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        logger.debug("[RouteGuard] Gated by LINE auth return", { flowId });
        setIsReadyToRender(false);
        return;
      }
    }

    const pathWithParams = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
    
    logger.debug("[RouteGuard] Computing redirect path", {
      flowId,
      pathWithParams,
      nextParamDecoded: nextParam ? decodeURIComponent(nextParam) : null
    });
    
    const redirectPath = authRedirectService.getRedirectPath(
      pathWithParams as RawURIComponent,
      decodeURIComponentWithType(nextParam),
    );

    logger.info("[RouteGuard] Redirect path computed", {
      flowId,
      from: pathWithParams,
      to: redirectPath,
      shouldRedirect: !!(redirectPath && redirectPath !== pathWithParams)
    });

    if (redirectPath && redirectPath !== pathWithParams) {
      if (redirectedRef.current !== redirectPath) {
        logger.info("[RouteGuard] Executing router.replace", { 
          flowId,
          to: redirectPath,
          previousRedirect: redirectedRef.current
        });
        redirectedRef.current = redirectPath;
        setIsReadyToRender(false);
        router.replace(redirectPath);
      } else {
        logger.debug("[RouteGuard] Skipping duplicate redirect", { 
          flowId,
          redirectPath
        });
      }
    } else {
      logger.debug("[RouteGuard] Ready to render", { flowId, pathname });
      redirectedRef.current = null;
      setIsReadyToRender(true);
    }
  }, [pathname, authState, loading, router, authRedirectService, nextParam, searchParams]);

  // --- 未確定中は描画しない（チラつき防止） ---
  if (!isReadyToRender) {
    return <LoadingIndicator />; // or return null;
  }

  return <>{children}</>;
};
