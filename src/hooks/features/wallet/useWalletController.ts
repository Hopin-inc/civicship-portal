'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLoading } from '../../../hooks/core/useLoading';
import { useWalletQuery } from './useWalletQuery';
import { useTransactionHistoryQuery } from './useTransactionHistoryQuery';
import { Transaction, TransactionNode, formatWalletData, transformTransaction } from '../../../lib/transformers/wallet';
import { useInfiniteScroll } from '../../../hooks/core/useInfiniteScroll';

/**
 * Main controller hook for wallet functionality
 * Combines wallet data, transaction history, and infinite scrolling
 * @param userId Optional user ID. If not provided, fetches current user's wallet
 */
export const useWalletController = (userId?: string) => {
  const { setIsLoading } = useLoading();
  const [currentPoint, setCurrentPoint] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { 
    data: walletData, 
    loading: walletLoading, 
    error: walletError 
  } = useWalletQuery(userId);
  
  const { 
    data: transactionData, 
    loading: transactionLoading, 
    error: transactionError,
    fetchMore
  } = useTransactionHistoryQuery(userId);
  
  useEffect(() => {
    setIsLoading(walletLoading || transactionLoading);
  }, [walletLoading, transactionLoading, setIsLoading]);
  
  useEffect(() => {
    if (walletData) {
      const { currentPoint, ticketCount } = formatWalletData(walletData);
      setCurrentPoint(currentPoint);
      setTicketCount(ticketCount);
    }
  }, [walletData]);
  
  useEffect(() => {
    if (transactionData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges) {
      const edges = transactionData.user.wallets.edges[0].node.transactions.edges;
      const formattedTransactions = edges.map(edge => transformTransaction(edge.node));
      
      setTransactions(formattedTransactions);
      setHasMore(transactionData.user.wallets.edges[0].node.transactions.pageInfo.hasNextPage);
    }
  }, [transactionData]);
  
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !userId) {
      return;
    }
    
    setIsLoadingMore(true);
    
    try {
      const lastTransaction = transactions[transactions.length - 1];
      const lastCursor = transactionData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges?.find(
        (edge: { node: TransactionNode; cursor: string }) => edge.node.id === lastTransaction.id
      )?.cursor;
      
      const { data: moreData } = await fetchMore({
        variables: {
          userId,
          first: 10,
          after: lastCursor
        }
      });
      
      if (moreData?.user?.wallets?.edges?.[0]?.node?.transactions?.edges) {
        const edges = moreData.user.wallets.edges[0].node.transactions.edges;
        const newTransactions = edges.map(edge => transformTransaction(edge.node));
        
        setTransactions(prev => [...prev, ...newTransactions]);
        setHasMore(moreData.user.wallets.edges[0].node.transactions.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more transactions:', error);
      toast.error('取引履歴の読み込みに失敗しました');
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, transactions, transactionData, fetchMore, userId]);
  
  const lastTransactionRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore
  });
  
  const handleError = useCallback(() => {
    if (walletError || transactionError) {
      console.error('Error fetching wallet data:', walletError || transactionError);
      toast.error('ウォレットデータの取得に失敗しました');
    }
  }, [walletError, transactionError]);
  
  useEffect(() => {
    handleError();
  }, [handleError]);
  
  return {
    currentPoint,
    ticketCount,
    transactions,
    isLoading: walletLoading || transactionLoading,
    isLoadingMore,
    hasMore,
    error: walletError || transactionError,
    loadMore,
    lastTransactionRef
  };
};

export default useWalletController;
