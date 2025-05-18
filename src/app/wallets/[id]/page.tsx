"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTransactionHistory } from "@/app/wallets/[id]/hooks/useTransactionHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useHeader } from "@/components/providers/HeaderProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import TransactionItem from "@/app/wallets/[id]/components/TransactionItem";
import ErrorState from "@/components/shared/ErrorState";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import EmptyState from "@/components/shared/EmptyState";
import { useParams } from "next/navigation";

export default function WalletPage() {
  const headerConfig = useMemo(
    () => ({
      title: "ポイント履歴",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const params = useParams();
  const walletId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { user } = useAuth();
  const { transactions, isLoading, error, refetch } = useTransactionHistory(
    user?.id ?? "",
    walletId ?? "",
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="ポイント履歴を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyState title={"ポイント履歴"} />;
  }

  return (
    <div className="flex flex-col bg-background rounded-lg overflow-hidden p-4">
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
