"use client";

import React, { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { applySsrAuthState } from "@/lib/auth/init/applySsrAuthState";
import { useAuthDependencies } from "@/hooks/auth/init/useAuthDependencies";
import { GqlUser } from "@/types/graphql";
import { TokenManager } from "@/lib/auth/core/token-manager";
import { logger } from "@/lib/logging";
import { useApolloClient } from "@apollo/client";
import { CurrentUserServerDocument } from "@/types/graphql";

interface AuthStateProviderProps {
  children: React.ReactNode;
  ssrCurrentUser?: GqlUser | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({
  children,
  ssrCurrentUser,
  ssrLineAuthenticated,
  ssrPhoneAuthenticated,
}) => {
  const { liffService, phoneAuthService } = useAuthDependencies();
  const apolloClient = useApolloClient();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    applySsrAuthState(ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated);

    useAuthStore.setState({
      actions: {
        logout: async () => {
          try {
            liffService.logout();

            phoneAuthService.reset();

            TokenManager.clearAllAuthFlags();

            useAuthStore.getState().setState({
              firebaseUser: null,
              currentUser: null,
              authenticationState: "unauthenticated",
              lineTokens: { accessToken: null, refreshToken: null, expiresAt: null },
            });

            logger.info("Logout completed successfully");
          } catch (error) {
            logger.error("Logout failed", { error });
            throw error;
          }
        },

        refetchUser: async () => {
          try {
            const { data } = await apolloClient.query({
              query: CurrentUserServerDocument,
              fetchPolicy: "network-only",
            });
            const user = data?.currentUser?.user ?? null;
            useAuthStore.getState().setState({ currentUser: user });
            logger.info("User refetched successfully", { userId: user?.id });
            return user;
          } catch (error) {
            logger.error("Failed to refetch user", { error });
            return null;
          }
        },
      },
    });
  }, [liffService, phoneAuthService, apolloClient, ssrCurrentUser, ssrLineAuthenticated, ssrPhoneAuthenticated]);

  return <>{children}</>;
};
