"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { notFound } from "next/navigation";
import { logger } from "@/lib/logging";

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
  const { data, loading, error } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    skip: !!ssrUser,
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
    logger.debug("[AUTH] /users/me ClientLayout: notFound", {
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
