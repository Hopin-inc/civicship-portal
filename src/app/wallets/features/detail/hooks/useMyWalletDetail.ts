"use client";

import { useCallback, useMemo } from "react";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";
import { GqlTransaction, useGetMyWalletWithTransactionsConnectionQuery } from "@/types/graphql";

/**
 * @deprecated This hook is deprecated and will be removed in a future version.
 * For TransactionList component, use the new SSR + refetch pattern:
 * - Use `useTransactionsInitial()` to get initial SSR data
 * - Use `useInfiniteTransactions()` with `fetchMyWalletTransactionsAction` for pagination
 * 
 * Migration example:
 * ```tsx
 * // Old pattern (deprecated)
 * const { transactions, loading, loadMore, hasNextPage } = useMyWalletDetail();
 * 
 * // New pattern (recommended)
 * const { initialTransactions } = useTransactionsInitial();
 * const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
 *   initialTransactions,
 *   fetchMore: fetchMyWalletTransactionsAction,
 * });
 * ```
 */
export interface UseMyWalletDetailResult {
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

/**
 * @deprecated Use the new SSR + refetch pattern instead. See UseMyWalletDetailResult for migration guide.
 */
export function useMyWalletDetail(): UseMyWalletDetailResult {
  const { data, loading, error, fetchMore } = useGetMyWalletWithTransactionsConnectionQuery({
    variables: {
      first: 20,
      sort: { createdAt: "desc" },
    },
    fetchPolicy: "cache-and-network",
  });

  const wallet = useMemo(() => {
    if (!data?.myWallet) return null;
    
    return {
      id: data.myWallet.id,
      type: data.myWallet.type,
      currentPoint: data.myWallet.currentPointView?.currentPoint ?? BigInt(0),
      accumulatedPoint: data.myWallet.accumulatedPointView?.accumulatedPoint ?? BigInt(0),
      user: data.myWallet.user,
      community: data.myWallet.community,
    };
  }, [data]);

  const transactions = useMemo(() => {
    const edges = data?.myWallet?.transactionsConnection?.edges ?? [];
    const walletId = data?.myWallet?.id ?? "";
    return edges
      .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
      .map((edge) => presenterTransaction(edge.node, walletId))
      .filter((tx): tx is AppTransaction => tx !== null);
  }, [data]);

  const loadMore = useCallback(() => {
    if (data?.myWallet?.transactionsConnection?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          cursor: data.myWallet.transactionsConnection.pageInfo.endCursor,
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
    hasNextPage: data?.myWallet?.transactionsConnection?.pageInfo?.hasNextPage ?? false,
  };
}
