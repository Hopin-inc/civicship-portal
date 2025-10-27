"use client";

import React from "react";
import TransactionItem from "@/components/shared/TransactionItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import Link from "next/link";
import { useWalletContext } from "@/app/wallets/features/shared/contexts/WalletContext";
import { useWalletTransactions } from "@/app/wallets/features/transactions/hooks/useWalletTransactions";

export function TransactionList() {
  const { walletId } = useWalletContext();

  const {
    transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useWalletTransactions(walletId);

  if (transactionsError) return <ErrorState title={"トランザクション履歴"} />;

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
        {isLoadingTransactions ? (
          <LoadingIndicator />
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            まだ交換したことがありません
          </p>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        )}
      </div>
    </div>
  );
}
