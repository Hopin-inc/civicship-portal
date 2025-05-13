'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/hooks/useLoading';
import { useGetUserWalletQuery } from '@/types/graphql';
import { presenterUserAsset } from '@/app/wallets/data/presenter';
import { UserAsset } from '@/app/wallets/data/type';

export const useWallet = (userId?: string) => {
  const { user: authUser } = useAuth();
  const targetId = userId || authUser?.id;

  const { setIsLoading } = useLoading();

  const [userAsset, setUserAsset] = useState<UserAsset>({
    points: {
      walletId: '',
      currentPoint: 0,
    },
    tickets: [],
  });

  const [isLoadingMore] = useState(false);

  const { data, loading, error } = useGetUserWalletQuery({
    variables: targetId ? { id: targetId } : undefined,
    skip: !targetId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (data?.user?.wallets?.[0]) {
      const asset = presenterUserAsset(data.user.wallets[0]);
      setUserAsset(asset);
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

export default useWallet;
