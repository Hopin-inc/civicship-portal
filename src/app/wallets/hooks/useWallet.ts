"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useGetUserWalletQuery } from "@/types/graphql";
import { presenterUserAsset } from "@/app/wallets/data/presenter";
import { UserAsset } from "@/app/wallets/data/type";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export const useWallet = (userId?: string) => {
  const { currentUser: authUser } = useAuthStore();
  const targetId = userId || authUser?.id;

  const [userAsset, setUserAsset] = useState<UserAsset>({
    points: {
      walletId: "",
      currentPoint: BigInt(0),
    },
    tickets: [],
  });

  const { data, loading, error, refetch } = useGetUserWalletQuery({
    variables: targetId ? { id: targetId } : undefined,
    skip: !targetId,
    fetchPolicy: "cache-and-network",
  });

  //TODO コミュニティウォレットをid指定で取得した方が安全になる
  useEffect(() => {
    if (data?.user?.wallets) {
      const walletData = data.user.wallets.find((w) => w.community?.id === COMMUNITY_ID);
      if (walletData) {
        setUserAsset(presenterUserAsset(walletData));
      }
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
