"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/app/wallets/components/WalletCard";
import { useGetCommunityWalletQuery } from "@/types/graphql";
import { Coins, Send } from "lucide-react";
import TransactionItem from "@/app/wallets/[id]/components/TransactionItem";
import useCommunityTransactions from "@/app/admin/wallet/hooks/useCommunityTransactions";
import { useRouter } from "next/navigation";

export default function TransactionPage() {
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
  const handleNavigateToIssue = () => {
    router.push("/admin/wallet/issue");
  };

  const handleNavigateToGrant = () => {
    router.push("/admin/wallet/grant");
  };

  const {
    data: walletData,
    loading: loadingWallet,
    refetch: refetchWallet,
  } = useGetCommunityWalletQuery();
  const walletId = walletData?.wallets.edges?.[0]?.node?.id ?? "";
  const currentPoint = walletData?.wallets.edges?.[0]?.node?.currentPointView?.currentPoint ?? 0;

  const {
    transactions,
    isLoading,
    // error,
    refetch: refetchTransactions,
  } = useCommunityTransactions(walletId);

  useEffect(() => {
    const handleFocus = () => {
      refetchWallet();
      refetchTransactions();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetchWallet, refetchTransactions]);

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8">
      <WalletCard currentPoint={currentPoint} isLoading={loadingWallet} />
      <div className="flex justify-center items-center gap-x-3">
        <Button
          onClick={handleNavigateToIssue}
          variant="tertiary"
          size="sm"
          className="flex items-center gap-1.5 w-[104px] h-[48px]"
        >
          <Coins className="w-4 h-4" />
          <span className="text-base">増やす</span>
        </Button>

        <Button
          onClick={handleNavigateToGrant}
          variant="tertiary"
          size="sm"
          className="flex items-center gap-1.5 w-[104px] h-[48px]"
        >
          <Send className="w-4 h-4" />
          <span className="text-base">渡す</span>
        </Button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
