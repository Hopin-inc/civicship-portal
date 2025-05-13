"use client";

import { useEffect, useMemo } from "react";
import { useGetUserFlexibleQuery } from "@/types/graphql";
import { useLoading } from "@/hooks/useLoading";
import { presenterManagerProfile } from "@/app/users/data/presenter";
export const useUserProfile = (userId: string) => {
  const { setIsLoading } = useLoading();

  const result = useGetUserFlexibleQuery({
    variables: {
      id: userId,
      withPortfolios: true,
      withOpportunities: true,
      withWallets: true,
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setIsLoading(result.loading);
  }, [result.loading, setIsLoading]);

  const userData = useMemo(() => {
    const user = result.data?.user;
    return user ? presenterManagerProfile(user) : null;
  }, [result.data]);

  return {
    userData,
    isLoading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
};
