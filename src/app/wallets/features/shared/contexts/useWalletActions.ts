import { useCallback } from "react";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";
import { presenterTransaction } from "@/utils/transaction";

interface WalletActionDeps {
  walletId: string;
  setCurrentPoint: (n: number) => void;
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  setHasNextPage: (b: boolean) => void;
  setEndCursor: (s: string | null) => void;
  setError: (e: Error | null) => void;
  setIsLoadingWallet: (b: boolean) => void;
  setIsLoadingTransactions: (b: boolean) => void;
  isLoadingTransactions: boolean;
  hasNextPage: boolean;
  endCursor: string | null;
}

export function useWalletActions({
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
}: WalletActionDeps) {
  const refresh = useCallback(async () => {
    setIsLoadingWallet(true);
    setError(null);
    try {
      const { fetchMyWalletWithTransactionsAction } = await import("./refetchActions");
      const result = await fetchMyWalletWithTransactionsAction();
      if (!result.wallet) throw new Error("Failed to fetch wallet");

      setCurrentPoint(toPointNumber(result.wallet.currentPoint, 0));

      const newTransactions = (result.transactions.edges ?? [])
        .map((edge) => presenterTransaction(edge?.node, walletId))
        .filter((tx): tx is any => tx !== null);

      setTransactions(newTransactions);
      setHasNextPage(result.transactions.pageInfo?.hasNextPage ?? false);
      setEndCursor(result.transactions.pageInfo?.endCursor ?? null);
    } catch (err) {
      logger.error("Failed to refresh wallet", { error: String(err), component: "WalletProvider" });
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoadingWallet(false);
    }
  }, [
    setCurrentPoint,
    setEndCursor,
    setError,
    setHasNextPage,
    setIsLoadingWallet,
    setTransactions,
    walletId,
  ]);

  const loadMore = useCallback(async () => {
    if (isLoadingTransactions || !hasNextPage || !endCursor) return;

    setIsLoadingTransactions(true);
    try {
      const { fetchMyWalletWithTransactionsAction } = await import("./refetchActions");
      const result = await fetchMyWalletWithTransactionsAction(endCursor, 20);

      const newTransactions = (result.transactions.edges ?? [])
        .map((edge) => presenterTransaction(edge?.node, walletId))
        .filter((tx): tx is any => tx !== null);

      setTransactions((prev) => [...prev, ...newTransactions]);
      setHasNextPage(result.transactions.pageInfo?.hasNextPage ?? false);
      setEndCursor(result.transactions.pageInfo?.endCursor ?? null);
    } catch (err) {
      logger.error("Failed to load more transactions", {
        error: String(err),
        component: "WalletProvider",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [
    isLoadingTransactions,
    hasNextPage,
    endCursor,
    setIsLoadingTransactions,
    setTransactions,
    setHasNextPage,
    setEndCursor,
    walletId,
  ]);

  return { refresh, loadMore };
}
