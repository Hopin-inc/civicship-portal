"use client";

import React, { createContext, useContext, useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useFirebaseAuthState } from "@/hooks/auth/useFirebaseAuthState";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useAuthValue } from "@/hooks/auth/useAuthValue";
import { useCurrentUserQuery } from "@/types/graphql";
import { initAuth } from "@/lib/auth/initAuth";
import { useAuthStore } from "@/hooks/auth/auth-store";
import { useLineAuthRedirectDetection } from "@/hooks/auth/useLineAuthRedirectDetection";
import { useLineAuthProcessing } from "@/hooks/auth/useLineAuthProcessing";
import { useAuthStateChangeListener } from "@/hooks/auth/useAuthStateChangeListener";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, ssrCurrentUser }) => {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const liffService = LiffService.getInstance(liffId);
  const phoneAuthService = PhoneAuthService.getInstance();
  const { state } = useAuthStore();

  const authStateManager = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  useEffect(() => {
    if (!authStateManager) return;
    void initAuth({ liffService, authStateManager, ssrCurrentUser });
  }, [authStateManager, liffService, ssrCurrentUser]);

  const { refetch: refetchUser } = useCurrentUserQuery({
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authenticationState,
    ),
    fetchPolicy: "network-only",
  });

  useFirebaseAuthState({ authStateManager });
  useAuthStateChangeListener({ authStateManager });
  // useTokenExpirationHandler({ logout });
  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ liffService });
  useLineAuthProcessing({ shouldProcessRedirect, liffService, refetchUser });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  const actions = React.useMemo(
    () => ({ logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification }),
    [logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification],
  );

  const value = useAuthValue({
    refetchUser,
    phoneAuthService,
    actions,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
