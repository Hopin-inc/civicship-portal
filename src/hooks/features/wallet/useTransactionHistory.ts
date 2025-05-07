'use client';

import { useTransactionHistoryController } from './useTransactionHistoryController';
import type { ErrorWithMessage } from './useWalletController';

/**
 * Public API hook for transaction history
 * This is the hook that should be used by components
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  isIncome: boolean;
}

export interface UseTransactionHistoryResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: ErrorWithMessage | null;
}

export const useTransactionHistory = (userId: string): UseTransactionHistoryResult => {
  return useTransactionHistoryController(userId);
};

export default useTransactionHistory;
