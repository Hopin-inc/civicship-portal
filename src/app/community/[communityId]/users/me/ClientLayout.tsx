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
  const authenticationState = useAuthStore((s) => s.state.authenticationState);

  // 認証完了前のクエリ発火を抑制する。
  // ssrUser がない場合でも、認証が loading/authenticating の間は
  // Bearer トークンなしの匿名リクエストになるためスキップする。
  const shouldSkipQuery = !!ssrUser
    || authenticationState === "loading"
    || authenticationState === "authenticating";

  const { data, loading, error } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    skip: shouldSkipQuery,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const csrUser = data?.currentUser?.user ?? null;

  // Log the current state for debugging
  logger.debug("[AUTH] /users/me ClientLayout state", {
    hasSsrUser: !!ssrUser,
    ssrUserId: ssrUser?.id,
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

  if (loading && !csrUser) {
    logger.debug("[AUTH] /users/me ClientLayout: loading spinner", {
      loading,
      hasCsrUser: !!csrUser,
      hasError: !!error,
      errorMessage: error?.message,
      component: "ClientLayout",
    });
    return <LoadingIndicator />;
  }

  if (!csrUser) {
    // During authentication, the CSR query may return null because the request is anonymous.
    // Wait for auth to complete before deciding the user doesn't exist.
    if (authenticationState === "loading" || authenticationState === "authenticating" || authenticationState === "line_authenticated") {
      logger.debug("[AUTH] /users/me ClientLayout: auth still in progress, showing loader", {
        authenticationState,
        component: "ClientLayout",
      });
      return <LoadingIndicator />;
    }
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
