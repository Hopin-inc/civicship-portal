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

    if (firebaseTenantId) setLineAuthTenantId(firebaseTenantId);

    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const idToken = await user.getIdToken();
      useAuthStore.getState().setState({
        firebaseUser: user,
        lineTokens: {
          idToken,
          refreshToken: user.refreshToken,
          expiresAt: null,
        },
      });
    });

    return () => {
      unsubscribe();
      setLineAuthTenantId(null);
    };
  }, []);

  return <>{children}</>;
}
