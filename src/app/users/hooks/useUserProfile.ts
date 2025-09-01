"use client";

import { useMemo, useEffect } from "react";
import { GqlPortfolioFilterInput, GqlPortfolioSortInput, InputMaybe, useGetUserFlexibleQuery } from "@/types/graphql";
import { presenterManagerProfile } from "@/app/users/data/presenter";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";

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
      ...(portfolioFilter ? { portfolioFilter } : {}),
      ...(portfolioSort ? { portfolioSort } : {}),
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      logger.debug("[PERF] useUserProfile query completed", {
        component: "useUserProfile",
        hasUser: !!data?.user,
        hasPortfolios: !!(data?.user?.portfolios && data.user.portfolios.length > 0),
        hasOpportunities: !!(data?.user?.opportunitiesCreatedByMe && data.user.opportunitiesCreatedByMe.length > 0),
        timestamp: new Date().toISOString(),
      });
    },
    onError: (error) => {
      logger.error("[PERF] useUserProfile query failed", {
        component: "useUserProfile",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    },
  });

  // クエリの開始を記録
  useEffect(() => {
    if (result.loading && userId) {
      logger.debug("[PERF] useUserProfile query started", {
        component: "useUserProfile",
        userId,
        timestamp: new Date().toISOString(),
      });
    }
  }, [result.loading, userId]);
  
  const userData = useMemo(() => {
    const user = result.data?.user;
    return user ? presenterManagerProfile(user, COMMUNITY_ID) : null;
  }, [result.data]);

  const selfOpportunities =
    result.data?.user?.opportunitiesCreatedByMe
      ?.filter((opportunity) => opportunity?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard) ?? [];

  return {
    userData,
    selfOpportunities,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
