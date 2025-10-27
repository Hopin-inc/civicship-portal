"use client";

import { useCallback, useMemo } from "react";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";
import { GqlTransaction, useGetWalletWithTransactionsConnectionQuery } from "@/types/graphql";

export interface UseWalletDetailResult {
  wallet: {
    id: string;
    type: string;
    currentPoint: bigint;
    accumulatedPoint: bigint;
    user?: {
      id: string;
      name: string;
      image?: string | null;
    } | null;
    community?: {
      id: string;
      name: string;
    } | null;
  } | null;
  transactions: AppTransaction[];
  loading: boolean;
  error: Error | null;
  loadMore: () => void;
  hasNextPage: boolean;
}

export function useWalletDetail(walletId: string): UseWalletDetailResult {
  const { data, loading, error, fetchMore } = useGetWalletWithTransactionsConnectionQuery({
    variables: {
      id: walletId,
      first: 20,
      sort: { createdAt: "desc" },
    },
    fetchPolicy: "cache-and-network",
  });

  const wallet = useMemo(() => {
    if (!data?.wallet) return null;
    
    return {
      id: data.wallet.id,
      type: data.wallet.type,
      currentPoint: data.wallet.currentPointView?.currentPoint ?? BigInt(0),
      accumulatedPoint: data.wallet.accumulatedPointView?.accumulatedPoint ?? BigInt(0),
      user: data.wallet.user,
      community: data.wallet.community,
    };
  }, [data]);

  const transactions = useMemo(() => {
    const edges = data?.wallet?.transactionsConnection?.edges ?? [];
    return edges
      .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
      .map((edge) => presenterTransaction(edge.node, walletId))
      .filter((tx): tx is AppTransaction => tx !== null);
  }, [data, walletId]);

  const loadMore = useCallback(() => {
    if (data?.wallet?.transactionsConnection?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data.wallet.transactionsConnection.pageInfo.endCursor,
        },
      });
    }
  }, [data, fetchMore]);

  return {
    wallet,
    transactions,
    loading,
    error: error ? new Error(error.message) : null,
    loadMore,
    hasNextPage: data?.wallet?.transactionsConnection?.pageInfo?.hasNextPage ?? false,
  };
}
