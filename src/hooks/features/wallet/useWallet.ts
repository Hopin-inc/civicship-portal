'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useWalletController } from './useWalletController';

/**
 * Custom hook for fetching and managing wallet data
 * This is a backward-compatible wrapper around useWalletController
 * @param userId Optional user ID. If not provided, fetches current user's wallet
 */
export const useWallet = (userId?: string) => {
  const { user: authUser } = useAuth();
  const targetId = userId || authUser?.id;
  
  const {
    currentPoint,
    ticketCount,
    transactions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    lastTransactionRef
  } = useWalletController(targetId);
  
  return {
    currentPoint,
    ticketCount,
    transactions,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore
  };
};

export default useWallet;
