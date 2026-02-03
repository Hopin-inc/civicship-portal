"use client";

import { ReactNode, useState } from "react";
import { WalletContext } from "./WalletContext";
import { useWalletActions } from "./useWalletActions";
import { AppTransaction } from "../type";
import { GqlTransactionsConnection } from "@/types/graphql";
import { presenterTransaction } from "@/utils/transaction";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

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
  const communityConfig = useCommunityConfig();
  const [currentPoint, setCurrentPoint] = useState(initialCurrentPoint);
  const [transactions, setTransactions] = useState<AppTransaction[]>(() => {
    const edges = initialTransactions.edges ?? [];
    return edges
      .map((edge) => presenterTransaction(edge?.node, walletId, communityConfig))
      .filter((tx): tx is AppTransaction => tx !== null);
  });
  const [hasNextPage, setHasNextPage] = useState(
    initialTransactions.pageInfo?.hasNextPage ?? false,
  );
  const [endCursor, setEndCursor] = useState<string | null>(
    initialTransactions.pageInfo?.endCursor ?? null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  const { refresh, loadMore } = useWalletActions({
    walletId,
    setCurrentPoint,
    setTransactions,
    setHasNextPage,
    setEndCursor,
    setError,
    setIsLoadingWallet,
    setIsLoadingTransactions,
    isLoadingTransactions,
    hasNextPage,
    endCursor,
  });

  return (
    <WalletContext.Provider
      value={{
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
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
