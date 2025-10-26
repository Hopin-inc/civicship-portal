"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import TransactionItem from "@/components/shared/TransactionItem";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useWallet } from "@/app/wallets/hooks/useWallet";
import useUserTransactions from "@/app/wallets/hooks/useUserTransaction";
import { presenterTransaction, getOtherUserImage } from "@/app/wallets/data/presenter";
import { toPointNumber } from "@/utils/bigint";
import { toast } from "sonner";
import { logger } from "@/lib/logging";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import Link from "next/link";

export default function WalletDetailPage() {
  const params = useParams();
  const walletId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;

  const headerConfig = useMemo(
    () => ({
      title: "保有ポイント",
      showBackButton: true,
      showLogo: false,
    }),
    []
  );
  useHeaderConfig(headerConfig);

  const { userAsset, isLoading, error, refetch: refetchWallet } = useWallet(userId);
  const {
    connection,
    loadMoreRef,
    refetch: refetchTransactions,
  } = useUserTransactions(userId ?? "");

  const currentPoint = toPointNumber(userAsset.points.currentPoint, 0);

  useEffect(() => {
    if (!isLoading && userAsset.points.walletId && userAsset.points.walletId !== walletId) {
      router.replace("/wallets");
    }
  }, [isLoading, userAsset.points.walletId, walletId, router]);

  useEffect(() => {
    if (shouldRefresh) {
      const refreshData = async () => {
        try {
          await Promise.all([refetchWallet(), refetchTransactions()]);
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh");
          window.history.replaceState({}, "", url);
        } catch (err) {
          logger.error("Refresh failed after redirect", {
            error: err instanceof Error ? err.message : String(err),
            component: "WalletDetailPage",
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
          component: "WalletDetailPage",
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchWallet, refetchTransactions]);

  const handleNavigateToGive = () =>
    router.push(`/wallets/donate?currentPoint=${currentPoint}&tab=history`);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetchWallet;
  }, [refetchWallet]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorState title={"ウォレット"} refetchRef={refetchRef} />;

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8 px-4">
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
        showRefreshButton={!shouldRefresh}
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
        {connection.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            まだ交換したことがありません
          </p>
        ) : (
          connection.edges?.map((edge) => {
            const node = edge?.node;
            if (!node) return null;
            const transaction = presenterTransaction(node, userAsset.points.walletId);
            if (!transaction) return null;
            const image = getOtherUserImage(node, userId ?? "");
            return <TransactionItem key={transaction.id} transaction={transaction} image={image} />;
          })
        )}

        <div ref={loadMoreRef} className="h-10" />
      </div>
    </div>
  );
}
