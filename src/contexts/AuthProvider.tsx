"use client";

import React, { createContext, useContext } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { detectEnvironment } from "@/lib/auth/environment-detector";
import { useCurrentUserQuery } from "@/types/graphql";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useAuthStateChangeListener } from "@/hooks/auth/useAuthStateChangeListener";
import { useTokenExpirationHandler } from "@/hooks/auth/useTokenExpirationHandler";
import { useFirebaseAuthState } from "@/hooks/auth/useFirebaseAuthState";
import { usePhoneAuthState } from "@/hooks/auth/usePhoneAuthState";
import { useUserRegistrationState } from "@/hooks/auth/useUserRegistrationState";
import { useLiffInitialization } from "@/hooks/auth/useLiffInitialization";
import { useLineAuthRedirectDetection } from "@/hooks/auth/useLineAuthRedirectDetection";
import { useLineAuthProcessing } from "@/hooks/auth/useLineAuthProcessing";
import useAutoLogin from "@/hooks/auth/useAutoLogin";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useAuthInitialization } from "@/hooks/auth/useAuthInitialization";
import { AuthProviderView } from "@/hooks/auth/AuthProviderView";
import { useAuthValue } from "@/hooks/auth/useAuthValue";
import { useAuthStore } from "@/hooks/auth/auth-store";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const environment = detectEnvironment();
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const liffService = LiffService.getInstance(liffId);
  const phoneAuthService = PhoneAuthService.getInstance();

  const state = useAuthStore((s) => s.state);
  const setStoreState = useAuthStore((s) => s.setState);

  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useCurrentUserQuery({
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authenticationState,
    ),
    fetchPolicy: "network-only",
  });

  const authStateManager = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  const { isAuthInitialized, authInitError, retryInitialization } = useAuthInitialization({
    authStateManager,
    setState: setStoreState,
  });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      state,
      setState: setStoreState,
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  useAuthStateChangeListener({ authStateManager, setState: setStoreState });
  useTokenExpirationHandler({ state, setState: setStoreState, logout });
  useFirebaseAuthState({ authStateManager, state, setState: setStoreState });
  usePhoneAuthState({ authStateManager, phoneAuthService, setState: setStoreState });
  useUserRegistrationState({ authStateManager, userData, setState: setStoreState });
  useLiffInitialization({ environment, liffService });
  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ state, liffService });
  useLineAuthProcessing({
    shouldProcessRedirect,
    liffService,
    setState: setStoreState,
    refetchUser,
  });
  useAutoLogin({ environment, state, liffService, setState: setStoreState, refetchUser });

  const actions = React.useMemo(
    () => ({ logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification }),
    [logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification],
  );

  const value = useAuthValue({
    state,
    userLoading,
    refetchUser,
    phoneAuthService,
    actions,
  });

  return (
    <AuthProviderView
      isAuthInitialized={isAuthInitialized}
      authInitError={authInitError}
      retryInitialization={retryInitialization}
    >
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </AuthProviderView>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
