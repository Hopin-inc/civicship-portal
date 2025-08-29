"use client";

import { useMemo } from "react";
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
  const queryStartTime = performance.now();
  const requestId = `profile-${queryStartTime}`;
  
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
      const queryEndTime = performance.now();
      const queryDuration = queryEndTime - queryStartTime;
      logger.info("✅ [PROFILE] GraphQLクエリ完了", {
        queryDuration: `${queryDuration.toFixed(2)}ms`,
        hasUser: !!data?.user,
        requestId,
        component: "useUserProfile"
      });
    },
    onError: (error) => {
      const queryEndTime = performance.now();
      const queryDuration = queryEndTime - queryStartTime;
      logger.error("❌ [PROFILE] GraphQLクエリエラー", {
        queryDuration: `${queryDuration.toFixed(2)}ms`,
        error: error.message,
        requestId,
        component: "useUserProfile"
      });
    }
  });
  
  const userData = useMemo(() => {
    const user = result.data?.user;
    if (!user) return null;
    
    const processedData = presenterManagerProfile(user as any, COMMUNITY_ID);
    return processedData;
  }, [result.data]);

  const selfOpportunities = useMemo(() => {
    const opportunities = result.data?.user?.opportunitiesCreatedByMe
      ?.filter((opportunity) => opportunity?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard) ?? [];
    
    return opportunities;
  }, [result.data?.user?.opportunitiesCreatedByMe]);

  return {
    userData,
    selfOpportunities,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
