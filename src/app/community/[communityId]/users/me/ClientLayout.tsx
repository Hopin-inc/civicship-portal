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
  const storeCurrentUser = useAuthStore((s) => s.state.currentUser);

  const { data, loading, error } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    skip: !!ssrUser,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const csrUser = data?.currentUser?.user ?? null;
  const effectiveUser = csrUser ?? storeCurrentUser;

  logger.warn("[AUTH] /users/me ClientLayout 🔍 state", {
    hasSsrUser: !!ssrUser,
    loading,
    hasCsrUser: !!csrUser,
    hasStoreUser: !!storeCurrentUser,
    hasEffectiveUser: !!effectiveUser,
    hasError: !!error,
    errorMessage: error?.message,
    component: "ClientLayout",
  });

  if (ssrUser) {
    return <>{children}</>;
  }

  if (loading && !effectiveUser) {
    return <LoadingIndicator />;
  }

  if (!effectiveUser) {
    logger.warn("[AUTH] /users/me ClientLayout 🔍 calling notFound()", {
      hasCsrUser: !!csrUser,
      hasStoreUser: !!storeCurrentUser,
      hasError: !!error,
      errorMessage: error?.message,
      component: "ClientLayout",
    });
    return notFound();
  }

  logger.warn("[AUTH] /users/me ClientLayout 🔍 rendering", {
    userId: effectiveUser.id,
    source: csrUser ? "apollo" : "store",
    hasPortfolios: !!(effectiveUser.portfolios?.length),
    component: "ClientLayout",
  });

  const portfolios = (effectiveUser.portfolios ?? []).map(mapGqlPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: effectiveUser.id,
        isOwner: true,
        gqlUser: effectiveUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
