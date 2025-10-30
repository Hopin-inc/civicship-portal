"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";

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
  const { data, loading } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    skip: !!ssrUser,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const csrUser = data?.currentUser?.user ?? null;

  if (ssrUser) {
    return <>{children}</>;
  }

  if (loading && !csrUser) {
    return <LoadingIndicator />;
  }

  // Show error state instead of notFound when user cannot be fetched
  // This handles both auth failures and server errors more gracefully
  if (!csrUser) {
    return <ErrorState title="ユーザー情報を読み込めませんでした" />;
  }

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
