"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/community/[communityId]/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { notFound } from "next/navigation";
import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";

interface CurrentUserProfileQueryResult {
  currentUser?: {
    user?: GqlUser | null;
  } | null;
}

interface ClientLayoutProps {
  children: React.ReactNode;
  ssrUser: GqlUser | null;
}

export function ClientLayout({ children, ssrUser }: ClientLayoutProps) {
  const { authenticationState, isAuthenticating, isAuthInProgress } = useAuthStore((s) => s.state);

  const isAuthLoading =
    isAuthenticating ||
    isAuthInProgress ||
    authenticationState === "loading" ||
    authenticationState === "authenticating";

  const { data, loading, error } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    // csrUser が存在しうる "user_registered" 状態のみクエリ実行
    skip: !!ssrUser || authenticationState !== "user_registered",
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const csrUser = data?.currentUser?.user ?? null;

  // Log the current state for debugging
  logger.debug("[AUTH] /users/me ClientLayout state", {
    hasSsrUser: !!ssrUser,
    ssrUserId: ssrUser?.id,
    authenticationState,
    isAuthLoading,
    loading,
    hasCsrUser: !!csrUser,
    csrUserId: csrUser?.id,
    hasError: !!error,
    errorMessage: error?.message,
    component: "ClientLayout",
  });

  if (ssrUser) {
    logger.debug("[AUTH] /users/me ClientLayout: using ssrUser", {
      component: "ClientLayout",
    });
    return <>{children}</>;
  }

  if (isAuthLoading || loading) {
    logger.debug("[AUTH] /users/me ClientLayout: loading spinner", {
      isAuthLoading,
      authenticationState,
      loading,
      component: "ClientLayout",
    });
    return <LoadingIndicator />;
  }

  if (authenticationState !== "user_registered") {
    // unauthenticated / line_authenticated / phone_authenticated → RouteGuard に委ねる
    logger.debug("[AUTH] /users/me ClientLayout: deferring to RouteGuard", {
      authenticationState,
      component: "ClientLayout",
    });
    return <LoadingIndicator />;
  }

  if (!csrUser) {
    logger.debug("[AUTH] /users/me ClientLayout: notFound", {
      authenticationState,
      component: "ClientLayout",
    });
    return notFound();
  }

  logger.debug("[AUTH] /users/me ClientLayout: rendering with csrUser", {
    csrUserId: csrUser.id,
    component: "ClientLayout",
  });

  const portfolios = (csrUser.portfolios ?? []).map(mapGqlPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: csrUser.id,
        isOwner: true,
        gqlUser: csrUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
