"use client";

import { TransactionCard } from "@/app/transactions/components/TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getServerWalletTransactionsWithCursor } from "@/hooks/transactions/server-wallet-transactions";
import { getCounterpartyImage, getFromWalletImage } from "@/shared/transactions/utils/images";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

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
  const communityConfig = useCommunityConfig();
  const communitySquareLogoPath = communityConfig?.squareLogoPath ?? "";

  const fetchMore = walletId
    ? (cursor?: string, first: number = 20) =>
        getServerWalletTransactionsWithCursor(walletId, cursor, first)
    : getServerCommunityTransactionsWithCursor;

  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore,
  });

  return (
    <div className="timeline-container">
      {transactions.map((transaction, index) => {
        const image = perspectiveWalletId
          ? getCounterpartyImage(transaction, perspectiveWalletId, communitySquareLogoPath)
          : getFromWalletImage(transaction, communitySquareLogoPath);
        const isFirst = index === 0;
        const isLast = index === transactions.length - 1;
        return (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            image={image}
            perspectiveWalletId={perspectiveWalletId}
            enableClickNavigation={enableClickNavigation}
            isFirst={isFirst}
            isLast={isLast}
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
