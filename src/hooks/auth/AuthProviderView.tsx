"use client";

import React from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";

type Props = {
  isAuthInitialized: boolean;
  authInitError: string | null;
  retryInitialization: () => void;
  children: React.ReactNode;
};

export const AuthProviderView: React.FC<Props> = ({
  isAuthInitialized,
  authInitError,
  retryInitialization,
  children,
}) => {
  if (!isAuthInitialized) {
    if (authInitError) {
      const refetchRef = { current: retryInitialization };
      return <ErrorState title="認証の初期化に失敗しました" refetchRef={refetchRef} />;
    }
    return <LoadingIndicator fullScreen />;
  }

  return <>{children}</>;
};
