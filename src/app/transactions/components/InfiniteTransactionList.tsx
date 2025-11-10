"use client";

import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getFromWalletImage, getCounterpartyImage } from "@/app/admin/wallet/data/presenter";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
  apiEndpoint?: string;
  perspectiveWalletId?: string;
  showSignedAmount?: boolean;
  showDid?: boolean;
}

export const InfiniteTransactionList = ({
  initialTransactions,
  apiEndpoint = "/api/transactions/community",
  perspectiveWalletId,
  showSignedAmount = false,
  showDid = false,
}: InfiniteTransactionListProps) => {
  const fetchMore = async (cursor: string, first: number): Promise<GqlTransactionsConnection> => {
    const params = new URLSearchParams({
      first: first.toString(),
    });
    if (cursor) {
      params.append("cursor", cursor);
    }
    
    const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    
    return response.json();
  };

  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore,
  });

  return (
    <div className="divide-y-8 divide-zinc-100">
      {transactions.map((transaction) => {
        const image = perspectiveWalletId
          ? getCounterpartyImage(transaction, perspectiveWalletId)
          : getFromWalletImage(transaction);
        return (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            image={image}
            perspectiveWalletId={perspectiveWalletId}
            showSignedAmount={showSignedAmount}
            showDid={showDid}
          />
        );
      })}

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && <LoadingIndicator fullScreen={false} />}
        </div>
      )}
    </div>
  );
};
