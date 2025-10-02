"use client";

import React, { createContext, useContext, useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useAuthStateChangeListener } from "@/hooks/auth/useAuthStateChangeListener";
import { useTokenExpirationHandler } from "@/hooks/auth/useTokenExpirationHandler";
import { useFirebaseAuthState } from "@/hooks/auth/useFirebaseAuthState";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useAuthValue } from "@/hooks/auth/useAuthValue";
import { useCurrentUserQuery } from "@/types/graphql";
import { initAuth } from "@/lib/auth/initAuth";
import { useAuthStore } from "@/hooks/auth/auth-store";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
    void initAuth({ liffService, authStateManager });
  }, [authStateManager, liffService]);

  const { refetch: refetchUser } = useCurrentUserQuery({
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authenticationState,
    ),
    fetchPolicy: "network-only",
  });

  // const { isAuthInitialized, authInitError, retryInitialization, userLoading } =
  //   useAuthInitialization({
  //     authStateManager,
  //   });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  // useLiffInitialization({ environment, liffService });
  // useAutoLogin({ environment, liffService, refetchUser });

  useFirebaseAuthState({ authStateManager });
  // usePhoneAuthState({ authStateManager, phoneAuthService });

  useAuthStateChangeListener({ authStateManager });
  useTokenExpirationHandler({ logout });

  // const { shouldProcessRedirect } = useLineAuthRedirectDetection({ liffService });
  // useLineAuthProcessing({
  //   shouldProcessRedirect,
  //   liffService,
  //   refetchUser,
  // });

  const actions = React.useMemo(
    () => ({ logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification }),
    [logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification],
  );

  const value = useAuthValue({
    refetchUser,
    phoneAuthService,
    actions,
  });

  return (
    // <AuthProviderView
    //   isAuthInitialized={isAuthInitialized}
    //   authInitError={authInitError}
    //   retryInitialization={retryInitialization}
    // >
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    // </AuthProviderView>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
