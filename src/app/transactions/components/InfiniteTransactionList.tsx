"use client";

import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";

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
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
      
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
