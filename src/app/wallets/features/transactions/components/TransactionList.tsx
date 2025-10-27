"use client";

import React from "react";
import TransactionItem from "@/components/shared/TransactionItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import Link from "next/link";
import { useTransactionsInitial } from "@/app/wallets/features/shared/contexts/TransactionsInitialContext";
import { useInfiniteTransactions } from "@/hooks/transactions/useInfiniteTransactions";
import { fetchMyWalletTransactionsAction } from "@/app/wallets/me/actions";

export function TransactionList() {
  const { initialTransactions } = useTransactionsInitial();
  const { transactions, hasNextPage, loading, loadMoreRef } = useInfiniteTransactions({
    initialTransactions,
    fetchMore: fetchMyWalletTransactionsAction,
  });

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-display-sm">これまでの交換</h2>
        <Link
          href="/transactions"
          className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
        >
          コミュニティ履歴へ
        </Link>
      </div>
      <div className="space-y-2 mt-2">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            まだ交換したことがありません
          </p>
        ) : (
          <>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                {loading && <LoadingIndicator />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
