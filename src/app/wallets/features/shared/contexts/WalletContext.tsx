"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";
import { fetchMyWalletTransactionsAction } from "@/app/wallets/me/actions";
import { AppTransaction } from "@/app/wallets/features/shared/data/type";
import { GqlTransaction, GqlTransactionsConnection } from "@/types/graphql";
import { presenterTransaction } from "@/app/wallets/features/shared/data/presenter";

export interface WalletContextValue {
  walletId: string;
  userId?: string;
  currentPoint: number;
  transactions: AppTransaction[];
  hasNextPage: boolean;
  isLoadingWallet: boolean;
  isLoadingTransactions: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export interface WalletProviderProps {
  children: ReactNode;
  walletId: string;
  userId?: string;
  initialCurrentPoint: number;
  initialTransactions: GqlTransactionsConnection;
}

export function WalletProvider({
  children,
  walletId,
  userId,
  initialCurrentPoint,
  initialTransactions,
}: WalletProviderProps) {
  const [currentPoint, setCurrentPoint] = useState(initialCurrentPoint);
  const [transactions, setTransactions] = useState<AppTransaction[]>(() => {
    const edges = initialTransactions.edges ?? [];
    return edges
      .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
      .map((edge) => presenterTransaction(edge.node, walletId))
      .filter((tx): tx is AppTransaction => tx !== null);
  });
  const [hasNextPage, setHasNextPage] = useState(initialTransactions.pageInfo?.hasNextPage ?? false);
  const [endCursor, setEndCursor] = useState<string | null>(initialTransactions.pageInfo?.endCursor ?? null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoadingWallet(true);
    setError(null);
    try {
      const { refreshMyWalletWithTransactionsAction } = await import("@/app/wallets/me/actions");
      const result = await refreshMyWalletWithTransactionsAction();
      
      setCurrentPoint(toPointNumber(result.currentPoint, 0));
      
      const edges = result.transactions.edges ?? [];
      const newTransactions = edges
        .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
        .map((edge) => presenterTransaction(edge.node, walletId))
        .filter((tx): tx is AppTransaction => tx !== null);
      
      setTransactions(newTransactions);
      setHasNextPage(result.transactions.pageInfo?.hasNextPage ?? false);
      setEndCursor(result.transactions.pageInfo?.endCursor ?? null);
    } catch (err) {
      logger.error("Failed to refresh wallet", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoadingWallet(false);
    }
  }, [walletId]);

  const loadMore = useCallback(async () => {
    if (isLoadingTransactions || !hasNextPage || !endCursor) return;

    setIsLoadingTransactions(true);
    try {
      const result = await fetchMyWalletTransactionsAction(endCursor, 20);
      
      const edges = result.edges ?? [];
      const newTransactions = edges
        .filter((edge): edge is { node: GqlTransaction } => !!edge?.node)
        .map((edge) => presenterTransaction(edge.node, walletId))
        .filter((tx): tx is AppTransaction => tx !== null);
      
      setTransactions((prev) => [...prev, ...newTransactions]);
      setHasNextPage(result.pageInfo?.hasNextPage ?? false);
      setEndCursor(result.pageInfo?.endCursor ?? null);
    } catch (err) {
      logger.error("Failed to load more transactions", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [isLoadingTransactions, hasNextPage, endCursor, walletId]);

  const value: WalletContextValue = {
    walletId,
    userId,
    currentPoint,
    transactions,
    hasNextPage,
    isLoadingWallet,
    isLoadingTransactions,
    error,
    refresh,
    loadMore,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWalletContext must be used within WalletProvider");
  return context;
}
