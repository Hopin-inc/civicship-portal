"use client";

import React, { useEffect, useRef } from "react";
import TransactionItem from "@/components/shared/TransactionItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import Link from "next/link";
import { useWalletContext } from "@/app/wallets/features/shared/contexts/WalletContext";

export function TransactionList() {
  const { transactions, hasNextPage, isLoadingTransactions, loadMore } = useWalletContext();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isLoadingTransactions) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isLoadingTransactions, loadMore]);

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
              <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {isLoadingTransactions && <LoadingIndicator />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
