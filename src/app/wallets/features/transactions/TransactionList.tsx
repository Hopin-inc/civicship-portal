"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { GqlTransactionsConnection } from "@/types/graphql";

interface TransactionListProps {
  walletId: string;
  initialTransactions: GqlTransactionsConnection;
}

export function TransactionList({ walletId, initialTransactions }: TransactionListProps) {
  const t = useTranslations();

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-display-sm">{t("transactions.list.title")}</h2>
        <Link
          href="/transactions"
          className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
        >
          {t("transactions.list.communityHistoryLink")}
        </Link>
      </div>
      <div className="mt-2">
        {initialTransactions.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            {t("transactions.list.emptyState")}
          </p>
        ) : (
          <InfiniteTransactionList
            initialTransactions={initialTransactions}
            walletId={walletId}
            perspectiveWalletId={walletId}
            showSignedAmount={true}
            showDid={true}
            useReceivedPhrasing={true}
            enableClickNavigation={true}
          />
        )}
      </div>
    </div>
  );
}
