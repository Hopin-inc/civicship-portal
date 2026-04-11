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

    console.log("[SsrAuthBridge] init", { firebaseTenantId });

    if (firebaseTenantId) setLineAuthTenantId(firebaseTenantId);

    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      console.log("[SsrAuthBridge] onAuthStateChanged", { user: !!user, tenantId: user?.tenantId });
      if (!user) return;

      try {
        const idToken = await user.getIdToken();
        useAuthStore.getState().setState({
          firebaseUser: user,
          authenticationState: "line_authenticated",
          lineTokens: {
            idToken,
            refreshToken: user.refreshToken,
            expiresAt: null,
          },
        });
        console.log("[SsrAuthBridge] auth store updated");
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
