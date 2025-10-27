"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import TransactionItem from "@/components/shared/TransactionItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import Link from "next/link";
import { useMyWalletDetail } from "@/app/wallets/features/detail/hooks";

export function TransactionList() {
  const { transactions, loading, loadMore, hasNextPage, error } = useMyWalletDetail();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasNextPage, loadMore]);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || loading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loading, isLoadingMore, handleLoadMore]);

  if (error) {
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
          <p className="text-sm text-red-500 text-center pt-6">
            トランザクションの読み込みに失敗しました
          </p>
        </div>
      </div>
    );
  }

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
        {loading && transactions.length === 0 ? (
          <LoadingIndicator />
        ) : transactions.length === 0 ? (
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
                {isLoadingMore && <LoadingIndicator />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
