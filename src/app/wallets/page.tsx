"use client";

import React, { useEffect, useMemo } from "react";
import { useWallet } from "@/app/wallets/hooks/useWallet";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/app/wallets/components/WalletCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import TransactionItem from "@/app/wallets/[id]/components/TransactionItem";
import { presenterTransaction } from "@/app/wallets/data/presenter";
import useUserTransactions from "@/app/wallets/hooks/useUserTransaction";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import logger from "@/lib/logging";

export default function UserWalletPage() {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;

  const headerConfig = useMemo(
    () => ({
      title: "保有ポイント",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const router = useRouter();
  const handleNavigateToGive = () => router.push(`/wallets/donate?currentPoint=${currentPoint}`);

  const { userAsset, isLoading, error, refetch: refetchWallet } = useWallet(userId);

  const {
    connection,
    loadMoreRef,
    refetch: refetchTransactions,
  } = useUserTransactions(userId ?? "");

  const walletId = userAsset.points.walletId;
  const currentPoint = userAsset.points.currentPoint;

  useEffect(() => {
    const handleFocus = async () => {
      try {
        await refetchWallet();
        refetchTransactions();
      } catch (err) {
        logger.error("Refetch failed on focus", {
          component: "UserWalletPage",
          userId: userId,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchWallet, refetchTransactions]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorState title={"ウォレット"} />;

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8  px-4">
      <WalletCard
        currentPoint={currentPoint}
        isLoading={isLoading}
        onRefetch={async () => {
          try {
            await refetchWallet();
            refetchTransactions();
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

      <div className="pt-10">
        <h2 className="text-display-sm">これまでの交換</h2>
      </div>
      <div className="space-y-2 mt-2">
        {connection.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            まだ交換したことがありません
          </p>
        ) : (
          connection.edges?.map((edge) => {
            const node = edge?.node;
            if (!node) return null;
            const transaction = presenterTransaction(node, walletId);
            if (!transaction) return null;
            return <TransactionItem key={transaction.id} transaction={transaction} />;
          })
        )}

        <div ref={loadMoreRef} className="h-10" />
      </div>
    </div>
  );
}
