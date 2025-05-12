'use client';


import { useLoading } from "@/hooks";
import { useEffect, useMemo } from "react";
import { presenterManagerProfile } from "@/presenters";
import { useGetUserFlexibleQuery } from "@/types/graphql";

export const useUserProfile = (userId: string) => {
  const { setIsLoading } = useLoading();

  const result = useGetUserFlexibleQuery({
    variables: {
      id: userId,
      withPortfolios: true,
      withOpportunities: true,
      withWallets: true
    },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
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
