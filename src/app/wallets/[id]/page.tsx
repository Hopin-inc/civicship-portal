"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import TransactionItem from "@/components/shared/TransactionItem";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import Link from "next/link";
import { useWalletContext } from "@/app/wallets/features/shared/contexts/WalletContext";
import { useWalletTransactions } from "@/app/wallets/[id]/features/transactions/hooks/useWalletTransactions";

export default function WalletDetailPage() {
  const router = useRouter();
  const {
    walletId,
    currentPoint,
    isLoading: isLoadingWallet,
    error: walletError,
    refresh,
  } = useWalletContext();

  const {
    transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useWalletTransactions(walletId);

  const headerConfig = useMemo(
    () => ({
      title: "保有ポイント",
      showBackButton: true,
      showLogo: false,
    }),
    []
  );
  useHeaderConfig(headerConfig);

  const handleNavigateToGive = () =>
    router.push(`/wallets/donate?currentPoint=${currentPoint}&tab=history`);

  if (isLoadingWallet) return <LoadingIndicator />;
  if (walletError || transactionsError) return <ErrorState title={"ウォレット"} />;

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8 px-4">
      <WalletCard
        currentPoint={currentPoint}
        isLoading={isLoadingWallet}
        onRefetch={async () => {
          try {
            await refresh();
            toast.success("ウォレット情報を更新しました");
          } catch (err) {
            toast.error("再読み込みに失敗しました");
          }
        }}
      />

      <div className="flex justify-center">
        <Button
          onClick={handleNavigateToGive}
          variant="secondary"
          size="sm"
          disabled={currentPoint <= 0}
          className="w-[104px] h-[48px] flex items-center gap-1.5"
        >
          <Gift className="w-4 h-4" />
          <span className="text-base">あげる</span>
        </Button>
      </div>

      <div className="pt-10 flex justify-between items-center">
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
