"use client";

import { useMemo } from "react";
import { GqlPortfolioFilterInput, GqlPortfolioSortInput, InputMaybe, useGetUserFlexibleQuery } from "@/types/graphql";
import { presenterManagerProfile } from "@/app/users/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { logger } from "@/lib/logging";

export const useUserProfile = (
  userId?: string,
  portfolioFilter?: InputMaybe<GqlPortfolioFilterInput>,
  portfolioSort?: InputMaybe<GqlPortfolioSortInput>,
) => {
  const queryStartTime = performance.now();
  
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
      logger.info("useUserProfile: GraphQLクエリ完了", {
        queryDuration: `${queryDuration.toFixed(2)}ms`,
        hasUser: !!data?.user,
        hasPortfolios: !!data?.user?.portfolios?.length,
        hasOpportunities: !!data?.user?.opportunitiesCreatedByMe?.length,
        hasWallets: !!data?.user?.wallets?.length,
        timestamp: queryEndTime,
        component: "useUserProfile"
      });
    },
    onError: (error) => {
      const queryEndTime = performance.now();
      const queryDuration = queryEndTime - queryStartTime;
      logger.error("useUserProfile: GraphQLクエリエラー", {
        queryDuration: `${queryDuration.toFixed(2)}ms`,
        error: error.message,
        timestamp: queryEndTime,
        component: "useUserProfile"
      });
    }
  });
  
  const userData = useMemo(() => {
    const processingStartTime = performance.now();
    const user = result.data?.user;
    if (!user) return null;
    
    const processedData = presenterManagerProfile(user as any, COMMUNITY_ID);
    const processingEndTime = performance.now();
    const processingDuration = processingEndTime - processingStartTime;
    
    logger.info("useUserProfile: ユーザーデータ処理完了", {
      processingDuration: `${processingDuration.toFixed(2)}ms`,
      hasResult: !!processedData,
      timestamp: processingEndTime,
      component: "useUserProfile"
    });
    
    return processedData;
  }, [result.data]);

  const selfOpportunities = useMemo(() => {
    const processingStartTime = performance.now();
    const opportunities = result.data?.user?.opportunitiesCreatedByMe
      ?.filter((opportunity) => opportunity?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard) ?? [];
    
    const processingEndTime = performance.now();
    const processingDuration = processingEndTime - processingStartTime;
    
    logger.info("useUserProfile: 機会データ処理完了", {
      processingDuration: `${processingDuration.toFixed(2)}ms`,
      totalOpportunities: result.data?.user?.opportunitiesCreatedByMe?.length || 0,
      filteredOpportunities: opportunities.length,
      timestamp: processingEndTime,
      component: "useUserProfile"
    });
    
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
