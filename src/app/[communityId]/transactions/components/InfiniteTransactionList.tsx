"use client";

import { useParams } from "next/navigation";
import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getFromWalletImage } from "@/app/[communityId]/admin/wallet/data/presenter";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
  fetchMore: (cursor: string, first: number) => Promise<GqlTransactionsConnection>;
}

export const InfiniteTransactionList = ({
  initialTransactions,
}: InfiniteTransactionListProps) => {
  const params = useParams();
  const communityId = params.communityId as string;
  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore: (cursor, first) => getServerCommunityTransactionsWithCursor(communityId, cursor, first),
  });

  return (
    <div className="timeline-container">
      {transactions.map((transaction) => {
        const image = getFromWalletImage(transaction);
        return (
          <TransactionCard
            key={transaction.id}
            transaction={transaction as any}
            image={image}
          />
        );
      })}

      {hasNextPage && (
        <div ref={loadMoreRef as any} className="flex justify-center py-4">
          {loading && (
            <LoadingIndicator fullScreen={false} />
          )}
        </div>
      )}
    </div>
  );
};
