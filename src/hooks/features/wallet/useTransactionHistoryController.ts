'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useTransactionHistoryQuery } from './useTransactionHistoryQuery';
import { formatTransactionDate, getTransactionDescription, transformTransaction } from '@/transformers/wallet';
import { ErrorWithMessage, formatError } from './useWalletController';

/**
 * Controller hook for transaction history
 * Handles business logic and state management for transaction history
 */
export const useTransactionHistoryController = (userId: string) => {
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    amount: number;
    description: string;
    date: string;
    isIncome: boolean;
  }>>([]);
  
  const { data, loading, error } = useTransactionHistoryQuery(userId);
  
  useEffect(() => {
    if (data?.user?.wallets?.edges) {
      const walletNode = data.user.wallets.edges[0]?.node;
      if (walletNode?.transactions?.edges) {
        const formattedTransactions = walletNode.transactions.edges
          .map(edge => {
            if (!edge?.node) return null;
            
            const transaction = edge.node;
            const isIncome = transaction.toUser?.id === userId;
            const amount = isIncome ? Math.abs(transaction.amount) : -Math.abs(transaction.amount);
            
            return {
              id: transaction.id,
              amount: amount || 0,
              description: getTransactionDescription(
                transaction.reason,
                transaction.fromUser?.name,
                transaction.toUser?.name
              ),
              date: formatTransactionDate(String(transaction.createdAt)),
              isIncome
            };
          })
          .filter(Boolean) as Array<{
            id: string;
            amount: number;
            description: string;
            date: string;
            isIncome: boolean;
          }>;
        
        setTransactions(formattedTransactions);
      }
    }
  }, [data, userId]);
  
  const formattedError = useMemo(() => {
    if (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('取引履歴の取得に失敗しました');
      return formatError(error);
    }
    return null;
  }, [error]);
  
  return {
    transactions,
    isLoading: loading,
    error: formattedError
  };
};
