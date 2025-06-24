"use client";

import { useMemo } from "react";
import { useGetUserFlexibleQuery } from "@/types/graphql";
import { presenterManagerProfile } from "@/app/users/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";

export const useUserProfile = (userId?: string) => {
  const result = useGetUserFlexibleQuery({
    variables: {
      id: userId ?? "", // 空文字でもOK
      withPortfolios: true,
      withOpportunities: true,
      withWallets: true,
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });
  console.log("result.data", result.data);
  const userData = useMemo(() => {
    const user = result.data?.user;
    return user ? presenterManagerProfile(user) : null;
  }, [result.data]);

  const selfOpportunities =
    result.data?.user?.opportunitiesCreatedByMe?.map(presenterActivityCard) ?? [];

  return {
    userData,
    selfOpportunities,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
