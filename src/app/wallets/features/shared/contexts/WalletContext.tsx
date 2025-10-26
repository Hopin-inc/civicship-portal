"use client";

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { WalletViewModel, TransactionViewModel } from "../types";
import { useGetUserWalletQuery } from "@/types/graphql";
import { presentWallet, presentTransaction } from "../mappers";
import { logger } from "@/lib/logging";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export interface WalletContextValue {
  userId?: string;
  walletId: string;
  walletView: WalletViewModel | null;
  transactions: TransactionViewModel[];
  isLoadingWallet: boolean;
  isLoadingTransactions: boolean;
  error: Error | null;
  refetchWallet: () => Promise<void>;
  refetchTransactions: () => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => void;
  hasNextPage: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export interface WalletProviderProps {
  children: ReactNode;
  initialWallet?: WalletViewModel | null;
  walletId: string;
  userId?: string;
}

export function WalletProvider({
  children,
  initialWallet,
  walletId,
  userId,
}: WalletProviderProps) {
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

  const [walletView, setWalletView] = useState<WalletViewModel | null>(
    initialWallet ?? null
  );
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const {
    data: walletData,
    loading: loadingWallet,
    refetch: refetchWalletQuery,
  } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (walletData?.user?.wallets) {
      const gqlWallet = walletData.user.wallets.find(
        (w) => w.community?.id === COMMUNITY_ID
      );
      if (gqlWallet) {
        setWalletView(presentWallet(gqlWallet, userId));

        const gqlTransactions = gqlWallet.transactions ?? [];
        const presentedTransactions = gqlTransactions
          .map((tx) => presentTransaction(tx, walletId))
          .filter((tx): tx is TransactionViewModel => tx !== null);
        setTransactions(presentedTransactions);
      }
    }
  }, [walletData, userId, walletId]);

  const refetchWallet = useCallback(async () => {
    try {
      await refetchWalletQuery();
    } catch (err) {
      logger.error("Failed to refetch wallet", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [refetchWalletQuery]);

  const refetchTransactions = useCallback(async () => {
    try {
      await refetchWalletQuery();
    } catch (err) {
      logger.error("Failed to refetch transactions", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [refetchWalletQuery]);

  const refresh = useCallback(async () => {
    try {
      await Promise.all([refetchWallet(), refetchTransactions()]);
    } catch (err) {
      logger.error("Failed to refresh wallet data", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [refetchWallet, refetchTransactions]);

  const loadMore = useCallback(() => {
    logger.info("Load more transactions requested", {
      component: "WalletProvider",
    });
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      const refreshData = async () => {
        try {
          await refresh();
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh");
          window.history.replaceState({}, "", url);
        } catch (err) {
          logger.error("Refresh failed after redirect", {
            error: err instanceof Error ? err.message : String(err),
            component: "WalletProvider",
          });
        }
      };
      refreshData();
    }
  }, [shouldRefresh, refresh]);

  useEffect(() => {
    const handleFocus = async () => {
      try {
        await refresh();
      } catch (err) {
        logger.error("Refetch failed on window focus", {
          error: err instanceof Error ? err.message : String(err),
          component: "WalletProvider",
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

  const value: WalletContextValue = {
    userId,
    walletId,
    walletView,
    transactions,
    isLoadingWallet: loadingWallet,
    isLoadingTransactions: loadingWallet,
    error,
    refetchWallet,
    refetchTransactions,
    refresh,
    loadMore,
    hasNextPage: false,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}
