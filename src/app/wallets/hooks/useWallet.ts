"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useGetUserWalletQuery } from "@/types/graphql";
import { presenterUserAsset } from "@/app/wallets/data/presenter";
import { UserAsset } from "@/app/wallets/data/type";

export const useWallet = (userId?: string) => {
  const { user: authUser } = useAuth();
  const targetId = userId || authUser?.id;

  const [userAsset, setUserAsset] = useState<UserAsset>({
    points: {
      walletId: "",
      currentPoint: 0,
    },
    tickets: [],
  });

  const { data, loading, error, refetch } = useGetUserWalletQuery({
    variables: targetId ? { id: targetId } : undefined,
    skip: !targetId,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.user?.wallets?.[0]) {
      const walletData = data.user.wallets[0];
      setUserAsset(presenterUserAsset(walletData));
    }
  }, [data]);

  return {
    userAsset,
    isLoading: loading,
    error,
    refetch,
  };
};

export default useWallet;
