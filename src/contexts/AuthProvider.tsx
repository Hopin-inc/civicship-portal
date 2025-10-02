"use client";

import React, { createContext, useContext } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { detectEnvironment } from "@/lib/auth/environment-detector";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { useAuthStateChangeListener } from "@/hooks/auth/useAuthStateChangeListener";
import { useTokenExpirationHandler } from "@/hooks/auth/useTokenExpirationHandler";
import { useFirebaseAuthState } from "@/hooks/auth/useFirebaseAuthState";
import { usePhoneAuthState } from "@/hooks/auth/usePhoneAuthState";
import { useLiffInitialization } from "@/hooks/auth/useLiffInitialization";
import { useLineAuthRedirectDetection } from "@/hooks/auth/useLineAuthRedirectDetection";
import { useLineAuthProcessing } from "@/hooks/auth/useLineAuthProcessing";
import useAutoLogin from "@/hooks/auth/useAutoLogin";
import { AuthContextType, AuthProviderProps } from "@/types/auth";
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

  const authStateManager = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  const { isAuthInitialized, authInitError, retryInitialization, userLoading, refetchUser } =
    useAuthInitialization({
      authStateManager,
    });

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  useAuthStateChangeListener({ authStateManager });
  useTokenExpirationHandler({ logout });
  useFirebaseAuthState({ authStateManager });
  usePhoneAuthState({ authStateManager, phoneAuthService });
  useLiffInitialization({ environment, liffService });
  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ liffService });
  useLineAuthProcessing({
    shouldProcessRedirect,
    liffService,
    refetchUser,
  });
  useAutoLogin({ environment, liffService, refetchUser });

  const actions = React.useMemo(
    () => ({ logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification }),
    [logout, createUser, loginWithLiff, verifyPhoneCode, startPhoneVerification],
  );

  const value = useAuthValue({
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
