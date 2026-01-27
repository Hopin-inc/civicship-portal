"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";
import { TransactionCard } from "@/app/[communityId]/transactions/components/TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getServerWalletTransactionsWithCursor } from "@/hooks/transactions/server-wallet-transactions";
import { getCounterpartyImage, getFromWalletImage } from "@/shared/transactions/utils/images";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
  walletId?: string;
  perspectiveWalletId?: string;
  showSignedAmount?: boolean;
  showDid?: boolean;
  useReceivedPhrasing?: boolean;
  enableClickNavigation?: boolean;
}

export const InfiniteTransactionList = ({
  initialTransactions,
  walletId,
  perspectiveWalletId,
  enableClickNavigation = false,
}: InfiniteTransactionListProps) => {
  const params = useParams();
  const communityId = params.communityId as string;

  const fetchMore = useCallback(
    async (cursor: string, first: number) => {
      if (walletId) {
        return getServerWalletTransactionsWithCursor(walletId, communityId, cursor, first);
      }
      return getServerCommunityTransactionsWithCursor(communityId, cursor, first);
    },
    [walletId, communityId],
  );

  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore,
  });

  return (
    <div className="timeline-container">
      {transactions.map((transaction, index) => {
        const image = perspectiveWalletId
          ? getCounterpartyImage(transaction, perspectiveWalletId)
          : getFromWalletImage(transaction);
        const isFirst = index === 0;
        const isLast = index === transactions.length - 1;
        return (
          <TransactionCard
            key={transaction.id}
            transaction={transaction as any}
            image={image}
            perspectiveWalletId={perspectiveWalletId}
            enableClickNavigation={enableClickNavigation}
            isFirst={isFirst}
            isLast={isLast}
          />
        );
      })}

      {hasNextPage && (
        <div ref={loadMoreRef as any} className="flex justify-center py-4">
          {loading && <LoadingIndicator fullScreen={false} />}
        </div>
      )}
    </div>
  );
};
