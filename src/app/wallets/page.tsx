"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useWallet } from "@/app/wallets/hooks/useWallet";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/app/wallets/components/WalletCard";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Gift } from "lucide-react";
import TransactionItem from "@/app/wallets/[id]/components/TransactionItem";
import { presenterTransaction } from "@/app/wallets/data/presenter";
import useUserTransactions from "@/app/wallets/hooks/useUserTransaction";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { logger } from "@/lib/logging";

export default function UserWalletPage() {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

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
  const handleNavigateToGive = () => router.push(`/wallets/donate?currentPoint=${currentPoint}&tab=history`);

  const { userAsset, isLoading, error, refetch: refetchWallet } = useWallet(userId);

  const {
    connection,
    loadMoreRef,
    refetch: refetchTransactions,
  } = useUserTransactions(userId ?? "");

  const walletId = userAsset.points.walletId;
  const currentPoint = userAsset.points.currentPoint;

  // 操作完了後のリダイレクトでrefreshパラメータがある場合、データを更新
  useEffect(() => {
    if (shouldRefresh) {
      const refreshData = async () => {
        try {
          await Promise.all([refetchWallet(), refetchTransactions()]);
          // URLからrefreshパラメータを削除（履歴に残さない）
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh");
          window.history.replaceState({}, "", url);
        } catch (err) {
          logger.error("Refresh failed after redirect", {
            error: err instanceof Error ? err.message : String(err),
            component: "UserWalletPage",
          });
        }
      };
      refreshData();
    }
  }, [shouldRefresh, refetchWallet, refetchTransactions]);

  useEffect(() => {
    const handleFocus = async () => {
      try {
        await refetchWallet();
        refetchTransactions();
      } catch (err) {
        logger.error("Refetch failed on focus", {
          error: err instanceof Error ? err.message : String(err),
          component: "UserWalletPage",
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchWallet, refetchTransactions]);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetchWallet;
  }, [refetchWallet]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorState title={"ウォレット"} refetchRef={refetchRef} />;

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
        showRefreshButton={!shouldRefresh} // 自動更新時は再読み込みボタンを非表示
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
