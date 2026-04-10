"use client";

import { ReactNode, useEffect, useRef } from "react";
import { applySsrAuthState } from "@/lib/auth/init/applySsrAuthState";
import { GqlUser } from "@/types/graphql";

interface SsrAuthBridgeProps {
  ssrCurrentUser: GqlUser | null;
  ssrLineAuthenticated: boolean;
  ssrPhoneAuthenticated: boolean;
  children: ReactNode;
}

export function SsrAuthBridge({
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
  children,
}: SsrAuthBridgeProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);
  }, []);

  return <>{children}</>;
}
