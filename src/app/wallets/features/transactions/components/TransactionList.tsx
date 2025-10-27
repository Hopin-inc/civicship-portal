"use client";

import React from "react";
import TransactionItem from "@/components/shared/TransactionItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import Link from "next/link";
import { useWalletContext } from "@/app/wallets/features/shared/contexts/WalletContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export function TransactionList() {
  const { transactions, hasNextPage, isLoadingTransactions, loadMore } = useWalletContext();
  const targetRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isLoadingTransactions,
    onLoadMore: loadMore,
    threshold: 0.1,
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
              <div ref={targetRef} className="h-10 flex items-center justify-center">
                {isLoadingTransactions && <LoadingIndicator />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
