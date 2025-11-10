"use client";

import { TransactionCard } from "./TransactionCard";
import { GqlTransactionsConnection } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";
import { getServerWalletTransactionsWithCursor } from "@/hooks/transactions/server-wallet-transactions";
import { getFromWalletImage, getCounterpartyImage } from "@/app/admin/wallet/data/presenter";

interface InfiniteTransactionListProps {
  initialTransactions: GqlTransactionsConnection;
  walletId?: string;
  perspectiveWalletId?: string;
  showSignedAmount?: boolean;
  showDid?: boolean;
}

export const InfiniteTransactionList = ({
  initialTransactions,
  walletId,
  perspectiveWalletId,
  showSignedAmount = false,
  showDid = false,
}: InfiniteTransactionListProps) => {
  const fetchMore = walletId
    ? (cursor?: string, first: number = 20) => getServerWalletTransactionsWithCursor(walletId, cursor, first)
    : getServerCommunityTransactionsWithCursor;

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
