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

/**
 * @deprecated Use useMyWalletDetail or useWalletDetail instead.
 * This hook will be removed in a future version.
 * 
 * The new hooks provide:
 * - Unified wallet + transactions query (better performance)
 * - Proper infinite scroll support with relay-style pagination
 * - Better Apollo Cache integration
 * 
 * Migration:
 * - For /wallets/me: Use useMyWalletDetail() from @/app/wallets/features/detail/hooks
 * - For /wallets/[id]: Use useWalletDetail(walletId) from @/app/wallets/features/detail/hooks
 */
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
