"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetTransactionsQuery } from "@/types/graphql";
import { toast } from "sonner";
import { AppTransaction } from "@/app/wallets/data/type";
import { presenterTransaction } from "@/app/wallets/data/presenter";

export interface UseTransactionHistoryResult {
  transactions: AppTransaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useTransactionHistory = (
  userId: string,
  walletId: string,
): UseTransactionHistoryResult => {
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);

  const { data, loading, error, refetch } = useGetTransactionsQuery({
    variables: { filter: { fromUserId: userId, toUserId: userId } },
    skip: !userId,
  });

  useEffect(() => {
    if (!data?.transactions?.edges) return;

    const txList: AppTransaction[] = data.transactions.edges
      .map((edge) => {
        if (!edge?.node) return null;
        return presenterTransaction(edge.node, walletId);
      })
      .filter((tx): tx is AppTransaction => tx !== null);

    setTransactions(txList);
  }, [data, walletId]);

  const formattedError = useMemo(() => {
    if (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("取引履歴の取得に失敗しました");
      return error;
    }
    return null;
  }, [error]);

  return {
    transactions,
    isLoading: loading,
    error: formattedError,
    refetch,
  };
};

export default useTransactionHistory;
