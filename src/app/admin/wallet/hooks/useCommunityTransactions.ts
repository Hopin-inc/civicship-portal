"use client";

import { useEffect, useMemo, useState } from "react";
import { GqlWalletType, useGetTransactionsQuery } from "@/types/graphql";
import { toast } from "sonner";
import { AppTransaction } from "@/app/wallets/data/type";
import { presenterTransaction } from "@/app/wallets/data/presenter";
import { COMMUNITY_ID } from "@/utils";

export interface UseCommunityTransactionsResult {
  transactions: AppTransaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const useCommunityTransactions = (walletId: string): UseCommunityTransactionsResult => {
  const [transactions, setTransactions] = useState<AppTransaction[]>([]);

  const { data, loading, error, refetch } = useGetTransactionsQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        or: [
          { fromWalletType: GqlWalletType.Community },
          { toWalletType: GqlWalletType.Community },
        ],
      },
    },
    fetchPolicy: "network-only",
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
      console.error("Error fetching community transactions:", error);
      toast.error("コミュニティ取引履歴の取得に失敗しました");
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

export default useCommunityTransactions;
