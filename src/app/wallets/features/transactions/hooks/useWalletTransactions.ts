"use client";

import { useCallback, useMemo } from "react";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";
import { GqlTransaction, useGetWalletTransactionsQuery } from "@/types/graphql";

export interface UseWalletTransactionsResult {
  transactions: AppTransaction[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasNextPage: boolean;
}

export function useWalletTransactions(walletId: string): UseWalletTransactionsResult {
  const { data, loading, error, fetchMore } = useGetWalletTransactionsQuery({
    variables: {
      filter: {
        or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
      },
      sort: { createdAt: "desc" },
      first: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  const transactions = useMemo(() => {
    const edges = data?.transactions?.edges ?? [];
    return edges
      .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
      .map((edge) => presenterTransaction(edge.node, walletId))
      .filter((tx): tx is AppTransaction => tx !== null);
  }, [data, walletId]);

  const loadMore = useCallback(() => {
    if (data?.transactions?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data.transactions.pageInfo.endCursor,
        },
      });
    }
  }, [data, fetchMore]);

  return {
    transactions,
    loading,
    error: error ? new Error(error.message) : null,
    loadMore,
    hasNextPage: data?.transactions?.pageInfo?.hasNextPage ?? false,
  };
}
