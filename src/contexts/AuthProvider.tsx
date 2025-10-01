"use client";

import React, { createContext, useContext, useState } from "react";
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
import { AuthContextType, AuthProviderProps, AuthState } from "@/types/auth";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useAuthInitialization } from "@/hooks/auth/useAuthInitialization";
import { AuthProviderView } from "@/hooks/auth/AuthProviderView";
import { useAuthValue } from "@/hooks/auth/useAuthValue";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const environment = detectEnvironment();

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const liffService = LiffService.getInstance(liffId);

  const phoneAuthService = PhoneAuthService.getInstance();

  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    currentUser: null,
    authenticationState: "loading",
    environment,
    isAuthenticating: false,
  });

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
    setState,
  });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      state,
      setState,
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  useAuthStateChangeListener({ authStateManager, setState });
  useTokenExpirationHandler({ state, setState, logout });
  useFirebaseAuthState({ authStateManager, state, setState });
  usePhoneAuthState({ authStateManager, phoneAuthService, setState });
  useUserRegistrationState({ authStateManager, userData, setState });
  useLiffInitialization({ environment, liffService });
  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ state, liffService });
  useLineAuthProcessing({ shouldProcessRedirect, liffService, setState, refetchUser });
  useAutoLogin({ environment, state, liffService, setState, refetchUser });

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
