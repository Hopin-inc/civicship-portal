"use client";

import { useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";
import { GqlTransaction } from "@/types/graphql";
import { GET_WALLET_TRANSACTIONS_QUERY } from "@/graphql/account/wallet/query";

export interface UseWalletTransactionsResult {
  transactions: AppTransaction[];
  isLoading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasNextPage: boolean;
}

export function useWalletTransactions(walletId: string): UseWalletTransactionsResult {
  const { data, loading, error, fetchMore } = useQuery(GET_WALLET_TRANSACTIONS_QUERY, {
    variables: {
      filter: {
        or: [
          { fromWalletId: walletId },
          { toWalletId: walletId }
        ]
      },
      sort: { createdAt: "DESC" },
      first: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  const transactions = useMemo(() => {
    const edges = data?.transactions?.edges ?? [];
    return edges
      .map((edge: { node: GqlTransaction }) => presenterTransaction(edge.node, walletId))
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
    isLoading: loading,
    error: error ? new Error(error.message) : null,
    loadMore,
    hasNextPage: data?.transactions?.pageInfo?.hasNextPage ?? false,
  };
}
