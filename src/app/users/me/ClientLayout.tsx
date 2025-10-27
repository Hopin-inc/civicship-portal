"use client";

import { useQuery } from "@apollo/client";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { GqlUser } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GET_CURRENT_USER_PROFILE } from "@/graphql/account/user/client-query";

interface CurrentUserProfileQueryResult {
  currentUser?: {
    user?: GqlUser | null;
  } | null;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, loading } = useQuery<CurrentUserProfileQueryResult>(GET_CURRENT_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const gqlUser = data?.currentUser?.user ?? null;

  useEffect(() => {
    if (!loading && !gqlUser) {
      router.replace("/login");
    }
  }, [loading, gqlUser, router]);

  if (loading && !gqlUser) {
    return <div>Loading...</div>;
  }

  if (!gqlUser) {
    return null;
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
