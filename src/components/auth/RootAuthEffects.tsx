"use client";

import { useEffect, useState } from "react";
import { useAuthSideEffects } from "@/hooks/auth/sideEffects";
import { LiffService } from "@/lib/auth/service/liff-service";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { AuthStateManager } from "@/lib/auth/core/auth-state-manager";

/**
 * RootAuthEffects - Mounts authentication side effects globally
 * 
 * This component runs useAuthSideEffects on all pages, but the hooks
 * are gated by URL-based LIFF callback detection to only activate
 * during actual LINE OAuth callbacks.
 */
export function RootAuthEffects() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const isLiffCallback = 
      searchParams.has("code") && 
      (searchParams.has("state") || searchParams.has("liff.state")) && 
      searchParams.has("liffClientId");

    setShouldMount(isLiffCallback);
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <AuthEffectsInner />;
}

function AuthEffectsInner() {
  const liffService = LiffService.getInstance();
  const authStateManager = AuthStateManager.getInstance();
  const actions = useAuthStore((s) => s.actions);

  useAuthSideEffects({
    authStateManager,
    liffService,
    refetchUser: actions?.refetchUser || (async () => null),
  });

  return null;
}
