"use client";

import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { useAuthStore } from "@/stores/auth-store";
import { isNoAuthPath } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from '@/components/shared';
import { logger } from "@/lib/logging";
import { GqlCurrentUserPayload, GqlCurrentPrefecture } from "@/types/graphql";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  authenticationState:
    | "unauthenticated"
    | "line_authenticated"
    | "line_token_expired"
    | "phone_authenticated"
    | "phone_token_expired"
    | "user_registered"
    | "loading";
  environment: AuthEnvironment;
  isAuthenticating: boolean;
};

export interface AuthContextType {
  user: GqlCurrentUserPayload["user"] | null;
  firebaseUser: User | null;
  uid: string | null;
  isAuthenticated: boolean;
  isPhoneVerified: boolean;
  isUserRegistered: boolean;
  authenticationState: AuthState["authenticationState"];
  isAuthenticating: boolean;
  environment: AuthEnvironment;
  loginWithLiff: (redirectPath?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
    clearRecaptcha: () => void;
    isVerifying: boolean;
    phoneUid: string | null;
  };
  createUser: (
    name: string,
    prefecture: GqlCurrentPrefecture,
    phoneUid: string | null
  ) => Promise<User | null>;
  updateAuthState: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const isNoAuthRequired = isNoAuthPath(pathname);
  
  const auth = useAuth();
  const { environment } = useAuthEnvironment();
  
  if (isNoAuthRequired) {
    return <>{children}</>;
  }

  if (auth.authenticationState === "loading") {
    logger.debug("[PERF] AuthProvider rendering loading indicator", {
      component: "AuthProvider",
      timestamp: new Date().toISOString(),
    });
    return <LoadingIndicator fullScreen={true} />;
  }

  const value: AuthContextType = {
    user: auth.currentUser,
    firebaseUser: auth.firebaseUser,
    uid: auth.firebaseUser?.uid || null,
    isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(
      auth.authenticationState,
    ),
    isPhoneVerified: ["phone_authenticated", "user_registered"].includes(auth.authenticationState),
    isUserRegistered: auth.authenticationState === "user_registered",
    authenticationState: auth.authenticationState,
    isAuthenticating: auth.isAuthenticating,
    environment: auth.environment,
    loginWithLiff: auth.loginWithLiff,
    logout: auth.logout,
    phoneAuth: {
      startPhoneVerification: auth.startPhoneVerification,
      verifyPhoneCode: auth.verifyPhoneCode,
      clearRecaptcha: () => auth.phoneAuthService?.clearRecaptcha(),
      isVerifying: auth.phoneAuthService?.getState().isVerifying || false,
      phoneUid: auth.phoneAuthService?.getState().phoneUid || null,
    },
    createUser: auth.createUser,
    updateAuthState: async () => {
      await auth.checkUserRegistration();
    },
    loading: auth.isAuthenticating,
  };

  logger.debug("[PERF] AuthProvider rendering main content", {
    component: "AuthProvider",
    authenticationState: auth.authenticationState,
    timestamp: new Date().toISOString(),
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export { useAuthStore as useAuth };
