"use client";

import React, { createContext, useContext } from "react";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";
import { useAuthActions } from "@/hooks/auth/actions";
import { useCurrentUserServerQuery, GqlCurrentPrefecture } from "@/types/graphql";
import { RawURIComponent } from "@/utils/path";
import { User } from "firebase/auth";

interface AuthInteractionContextType {
  loginWithLiff: (redirectPath?: RawURIComponent) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (
    name: string,
    prefecture: GqlCurrentPrefecture,
    phoneUid: string,
  ) => Promise<User | null>;
  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
    clearRecaptcha?: () => void;
    isVerifying: boolean;
    phoneUid: string | null;
    phoneNumber: string | null;
  };
}

const AuthInteractionContext = createContext<AuthInteractionContextType | undefined>(undefined);

export const AuthInteractionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { liffService, phoneAuthService, authStateManager } = useAuthDependencies();

  const { refetch } = useCurrentUserServerQuery({
    fetchPolicy: "network-only",
  });

  const refetchUser = React.useCallback(async () => {
    const { data } = await refetch();
    return data?.currentUser?.user ?? null;
  }, [refetch]);

  const { logout, createUser, loginWithLiff, startPhoneVerification, verifyPhoneCode } =
    useAuthActions({
      authStateManager,
      liffService,
      phoneAuthService,
      refetchUser,
    });

  const phoneAuth = React.useMemo(
    () => ({
      startPhoneVerification,
      verifyPhoneCode,
      clearRecaptcha: phoneAuthService?.clearRecaptcha,
      isVerifying: phoneAuthService?.isVerifying ?? false,
      phoneUid: phoneAuthService?.phoneUid ?? null,
      phoneNumber: phoneAuthService?.phoneNumber ?? null,
    }),
    [startPhoneVerification, verifyPhoneCode, phoneAuthService],
  );

  const value = React.useMemo(
    () => ({
      loginWithLiff,
      logout,
      createUser,
      phoneAuth,
    }),
    [loginWithLiff, logout, createUser, phoneAuth],
  );

  return <AuthInteractionContext.Provider value={value}>{children}</AuthInteractionContext.Provider>;
};

export const useAuthInteraction = (): AuthInteractionContextType => {
  const context = useContext(AuthInteractionContext);
  if (context === undefined) {
    throw new Error("useAuthInteraction must be used within an AuthInteractionProvider");
  }
  return context;
};
