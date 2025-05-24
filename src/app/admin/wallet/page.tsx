"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/app/wallets/components/WalletCard";
import { GqlRole, useGetCommunityWalletQuery } from "@/types/graphql";
import { Coins, Gift } from "lucide-react";
import TransactionItem from "@/app/wallets/[id]/components/TransactionItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { presenterTransaction } from "@/app/wallets/data/presenter";
import useCommunityTransactions from "@/app/admin/wallet/hooks/useCommunityTransactions";

export default function WalletPage() {
  const communityId = COMMUNITY_ID;
  const { user: currentUser } = useAuth();
  const currentUserRole = currentUser?.memberships?.find(
    (m) => m.community?.id === communityId,
  )?.role;

  const headerConfig = useMemo(
    () => ({
      title: "ウォレット",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const router = useRouter();
  const handleNavigateToIssue = () => router.push("/admin/wallet/issue");
  const handleNavigateToGrant = () =>
    router.push(`/admin/wallet/grant?currentPoint=${currentPoint}`);

  const {
    data: walletData,
    loading: loadingWallet,
    refetch: refetchWallet,
  } = useGetCommunityWalletQuery();

  const walletId = walletData?.wallets.edges?.[0]?.node?.id ?? "";
  const currentPoint = walletData?.wallets.edges?.[0]?.node?.currentPointView?.currentPoint ?? 0;

  const { connection, loadMoreRef, refetch: refetchTransactions } = useCommunityTransactions();

  useEffect(() => {
    const handleFocus = async () => {
      try {
        await refetchWallet();
        refetchTransactions();
      } catch (err) {
        console.error("Refetch failed on window focus", err);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetchWallet, refetchTransactions]);

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8 px-4">
      <WalletCard
        currentPoint={currentPoint}
        isLoading={loadingWallet}
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

      <div className="flex justify-center items-center gap-x-3">
        <Button
          disabled={currentUserRole !== GqlRole.Owner}
          onClick={handleNavigateToIssue}
          variant="secondary"
          size="sm"
          className="w-[104px] h-[48px] flex items-center gap-1.5"
        >
          <Coins className="w-4 h-4" />
          <span className="text-base">発行</span>
        </Button>
        <Button
          disabled={currentUserRole !== GqlRole.Owner || currentPoint <= 0}
          onClick={handleNavigateToGrant}
          variant="secondary"
          size="sm"
          className="w-[104px] h-[48px] flex items-center gap-1.5"
        >
          <Gift className="w-4 h-4" />
          <span className="text-base">支給</span>
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
