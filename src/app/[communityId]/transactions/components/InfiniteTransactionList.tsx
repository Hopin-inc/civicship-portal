"use client";

import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getFromWalletImage } from "@/app/[communityId]/admin/wallet/data/presenter";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
  enableClickNavigation?: boolean;
}

export const InfiniteTransactionList = ({
  initialTransactions,
  enableClickNavigation = false,
}: InfiniteTransactionListProps) => {
  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore: getServerCommunityTransactionsWithCursor,
  });

  return (
    <div className="timeline-container">
      {transactions.map((transaction) => {
        const image = getFromWalletImage(transaction);
        return (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            image={image}
            enableClickNavigation={enableClickNavigation}
          />
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
