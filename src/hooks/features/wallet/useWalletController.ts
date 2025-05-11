'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLoading } from '@/hooks/core/useLoading';
import { presenterUserAsset } from "@/presenters/wallet";
import { useGetUserWalletQuery } from "@/types/graphql";
import { UserAsset } from "@/types/wallet";

export const useWalletController = (userId?: string) => {
  const { setIsLoading } = useLoading();
  const [userAsset, setUserAsset] = useState<UserAsset>({
    points: {
      walletId: '',
      currentPoint: 0,
    },
    tickets: [],
  });
  const [isLoadingMore] = useState(false);
  
  const { data, loading, error } = useGetUserWalletQuery( {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading,  setIsLoading]);
  
  useEffect(() => {
    if (data) {
      const userAsset = presenterUserAsset(data.user?.wallets?.[0]);
      setUserAsset(userAsset);
    }
  }, [data]);

  if (error) {
    console.error('Error fetching wallet data:', error);
    toast.error('ウォレットの取得に失敗しました');
  }
  
  return {
    userAsset,
    isLoading: loading || false,
    isLoadingMore,
    error,
  };
};

export default useWalletController;
