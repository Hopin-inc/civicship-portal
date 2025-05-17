"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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

  const [isLoadingMore] = useState(false);

  const { data, loading, error, refetch } = useGetUserWalletQuery({
    variables: targetId ? { id: targetId } : undefined,
    skip: !targetId,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.user?.wallets?.[0]) {
      const asset = presenterUserAsset(data.user.wallets[0]);
      setUserAsset(asset);
    }
  }, [data]);

  return {
    userAsset,
    isLoading: loading || false,
    isLoadingMore,
    error,
    refetch,
  };
};

export default useWallet;
