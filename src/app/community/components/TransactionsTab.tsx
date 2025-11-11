"use client";

import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { GqlTransactionsConnection } from "@/types/graphql";

interface TransactionsTabProps {
  initialTransactions: GqlTransactionsConnection;
}

export function TransactionsTab({ initialTransactions }: TransactionsTabProps) {
  return (
    <div className="mt-6 px-4">
      {initialTransactions.edges?.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center pt-6">
          交換履歴がありません
        </p>
      ) : (
        <InfiniteTransactionList
          initialTransactions={initialTransactions}
          enableClickNavigation={true}
        />
      )}
    </div>
  );
}
