"use client";

import { ReactNode, useEffect, useRef } from "react";
import { applySsrAuthState } from "@/lib/auth/init/applySsrAuthState";
import { lineAuth, setLineAuthTenantId } from "@/lib/auth/core/firebase-config";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { GqlUser } from "@/types/graphql";

interface SsrAuthBridgeProps {
  ssrCurrentUser: GqlUser | null;
  ssrLineAuthenticated: boolean;
  ssrPhoneAuthenticated: boolean;
  firebaseTenantId: string | null;
  children: ReactNode;
}

export function SsrAuthBridge({
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
  firebaseTenantId,
  children,
}: SsrAuthBridgeProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log("[SsrAuthBridge] init", {
      firebaseTenantId,
      ssrCurrentUser: !!ssrCurrentUser,
      ssrLineAuthenticated,
      ssrPhoneAuthenticated,
      lineAuthCurrentTenantId: lineAuth.tenantId,
      authStoreBefore: useAuthStore.getState().state.authenticationState,
    });

    if (firebaseTenantId) setLineAuthTenantId(firebaseTenantId);

    console.log("[SsrAuthBridge] after setLineAuthTenantId", {
      lineAuthTenantId: lineAuth.tenantId,
    });

    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    console.log("[SsrAuthBridge] after applySsrAuthState", {
      authStoreState: useAuthStore.getState().state.authenticationState,
      firebaseUser: !!useAuthStore.getState().state.firebaseUser,
      lineTokensIdToken: !!useAuthStore.getState().state.lineTokens.idToken,
    });

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      console.log("[SsrAuthBridge] onAuthStateChanged fired", {
        user: !!user,
        userTenantId: user?.tenantId ?? null,
        lineAuthTenantId: lineAuth.tenantId,
      });

      if (!user) {
        console.log("[SsrAuthBridge] no firebase user in localStorage for this tenant");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        console.log("[SsrAuthBridge] got idToken, updating store", {
          hasIdToken: !!idToken,
          userTenantId: user.tenantId,
        });
        useAuthStore.getState().setState({
          firebaseUser: user,
          authenticationState: "line_authenticated",
          lineTokens: {
            idToken,
            refreshToken: user.refreshToken,
            expiresAt: null,
          },
        });
        console.log("[SsrAuthBridge] store updated", {
          authState: useAuthStore.getState().state.authenticationState,
          firebaseUser: !!useAuthStore.getState().state.firebaseUser,
        });
      } catch (e) {
        console.error("[SsrAuthBridge] getIdToken failed", e);
      }
    });

    return () => {
      unsubscribe();
      setLineAuthTenantId(null);
    };
  }, []);

  return <>{children}</>;
}
