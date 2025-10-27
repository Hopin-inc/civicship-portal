"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { notFound } from "next/navigation";

interface CurrentUserProfileQueryResult {
  currentUser?: {
    user?: GqlUser | null;
  } | null;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const gqlUser = data?.currentUser?.user ?? null;

  if (loading && !gqlUser) {
    return <LoadingIndicator />;
  }

  if (!gqlUser) {
    return notFound();
  }

  const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: gqlUser.id,
        isOwner: true,
        gqlUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
