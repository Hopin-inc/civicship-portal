'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { WalletTransactionsDocument, useWalletTransactionsQuery, GqlWalletTransactionsQuery } from '@/types/graphql';
import { formatTransactionDate, getTransactionDescription } from '@/transformers/wallet';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  isIncome: boolean;
}

export const useTransactionHistory = (userId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const { data, loading, error } = useQuery(WalletTransactionsDocument, {
    variables: { 
      filter: {
        fromWalletId: userId,
        toWalletId: userId,
      }
    },
    skip: !userId,
  });
  
  useEffect(() => {
    if (data?.transactions?.edges) {
      const formattedTransactions = data.transactions.edges
        .map((edge: NonNullable<NonNullable<GqlWalletTransactionsQuery['transactions']['edges']>[number]>) => {
          if (!edge?.node) return null;
          
          const transaction = edge.node;
          const isIncome = transaction.toPointChange != null && transaction.toPointChange > 0;
          const amount = isIncome ? transaction.toPointChange : transaction.fromPointChange;
          
          return {
            id: transaction.id,
            amount: amount || 0,
            description: getTransactionDescription(
              transaction.reason,
              transaction.fromWallet?.user?.name,
              transaction.toWallet?.user?.name
            ),
            date: formatTransactionDate(String(transaction.createdAt)),
            isIncome
          };
        })
        .filter(Boolean) as Transaction[];
      
      setTransactions(formattedTransactions);
    }
  }, [data]);
  
  return {
    transactions,
    isLoading: loading,
    error
  };
};

export default useTransactionHistory;
