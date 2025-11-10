"use client";

import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getFromWalletImage, getToWalletImage } from "@/app/admin/wallet/data/presenter";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
}

export const InfiniteTransactionList = ({ initialTransactions }: InfiniteTransactionListProps) => {
  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore: getServerCommunityTransactionsWithCursor,
  });

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => {
        const image = getFromWalletImage(transaction);
        return (
          <TransactionCard key={transaction.id} transaction={transaction} image={image} />
        );
      })}
      
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {loading && (
            <LoadingIndicator fullScreen={false} />
          )}
        </div>
      )}
    </div>
  );
};
