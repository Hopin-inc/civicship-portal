"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { decodeURIComponentWithType, EncodedURIComponent, RawURIComponent } from "@/utils/path";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

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
  const redirectedRef = React.useRef<string | null>(null); // ← ① 追加（useEffectの外）

  // --- 共通ログ関数 ---
  const log = (step: string, data?: Record<string, any>) => {
    const entry = { ts: new Date().toISOString(), step, ...data };
    console.log("[ROUTE GUARD]", entry);
    try {
      const existing = JSON.parse(localStorage.getItem("route-guard-debug") || "[]");
      existing.push(entry);
      localStorage.setItem("route-guard-debug", JSON.stringify(existing.slice(-200)));
    } catch {}
  };

  useEffect(() => {
    log("🌀 useEffect triggered", {
      pathname,
      authenticationState: authState.authenticationState,
      loading,
      isAuthenticating: authState.isAuthenticating,
      isAuthInProgress: authState.isAuthInProgress,
    });

    // --- ローディング中はレンダー止める ---
    if (loading || authState.isAuthenticating || authState.isAuthInProgress) {
      log("⏸ skip: still loading/authenticating");
      setIsReadyToRender(false);
      return;
    }

    // --- 中間状態も止める ---
    if (["loading", "authenticating"].includes(authState.authenticationState)) {
      log("⏸ skip: transient state", { authenticationState: authState.authenticationState });
      setIsReadyToRender(false);
      return;
    }

    // --- LINEリダイレクト中は止める ---
    if (typeof window !== "undefined" && pathname === "/") {
      const urlParams = new URLSearchParams(window.location.search);
      const isReturnFromLineAuth =
        urlParams.has("code") && urlParams.has("state") && urlParams.has("liffClientId");
      if (isReturnFromLineAuth) {
        log("🚪 skip redirect: return from LINE auth", { pathname });
        setIsReadyToRender(false);
        return;
      }
    }

    // --- リダイレクト判定 ---
    const pathWithParams = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;
    const redirectPath = authRedirectService.getRedirectPath(
      pathWithParams as RawURIComponent,
      decodeURIComponentWithType(nextParam),
    );

    log("🔍 evaluating redirect", {
      pathWithParams,
      redirectPath,
      authenticationState: authState.authenticationState,
    });

    if (redirectPath) {
      // ✅ 二重リダイレクト防止
      if (redirectedRef.current !== redirectPath) {
        log("🚀 redirecting", { from: pathWithParams, to: redirectPath });
        redirectedRef.current = redirectPath; // ← ② 記録
        setIsReadyToRender(false);
        router.replace(redirectPath);
      } else {
        log("🛑 skip duplicate redirect", { redirectPath });
      }
    } else {
      log("✅ no redirect (stays on page)", { pathname });
      redirectedRef.current = null; // ← ③ リセット（次回遷移に備える）
      setIsReadyToRender(true);
    }
  }, [pathname, authState, loading, router, authRedirectService, nextParam, searchParams]);

  // --- 未確定中は描画しない（チラつき防止） ---
  if (!isReadyToRender) {
    return <LoadingIndicator />; // or return null;
  }

  return <>{children}</>;
};
