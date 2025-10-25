"use client";

import { useMemo } from "react";
import {
  GqlPortfolioFilterInput,
  GqlPortfolioSortInput,
  InputMaybe,
  useGetUserFlexibleQuery,
} from "@/types/graphql";
import { presenterManagerProfile } from "@/app/users/presenters";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export const useUserProfile = (
  userId?: string,
  portfolioFilter?: InputMaybe<GqlPortfolioFilterInput>,
  portfolioSort?: InputMaybe<GqlPortfolioSortInput>,
) => {
  const result = useGetUserFlexibleQuery({
    variables: {
      id: userId ?? "",
      withPortfolios: true,
      withOpportunities: true,
      withWallets: true,
      withNftInstances: true,
      ...(portfolioFilter ? { portfolioFilter } : {}),
      ...(portfolioSort ? { portfolioSort } : {}),
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const userData = useMemo(() => {
    const user = result.data?.user;
    return user ? presenterManagerProfile(user, COMMUNITY_ID) : null;
  }, [result.data]);

  const nftInstances = result.data?.user?.nftInstances?.edges?.map((edge) => edge.node) ?? [];

  const selfOpportunities =
    result.data?.user?.opportunitiesCreatedByMe
      ?.filter((opportunity) => opportunity?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard) ?? [];

  return {
    userData,
    nftInstances,
    selfOpportunities,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
