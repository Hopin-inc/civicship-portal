"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useWallet } from "@/app/wallets/hooks/useWallet";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { WalletCard } from "@/app/wallets/components/WalletCard";
import { WalletHistoryButton } from "@/app/wallets/components/WalletHistoryButton";
import { WalletInfoSection } from "@/app/wallets/components/WalletInfoSection";
import { WalletUsageSection } from "@/app/wallets/components/WalletUsageSection";
import ErrorState from "@/components/shared/ErrorState";

export default function WalletsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "保有ポイント",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { userAsset, isLoading, error, refetch } = useWallet();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="保有ポイントを読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-4 py-6">
      <WalletCard currentPoint={userAsset.points.currentPoint} isLoading={isLoading} />
      <WalletHistoryButton walletId={userAsset.points.walletId} />
      <WalletInfoSection />
      <WalletUsageSection
        title="ポイントを使う"
        message="ポイントを使ってサービスを利用できるようになったら、LINEからお伝えします💪"
      />
      <WalletUsageSection
        title="ポイントをもらう"
        message="ポイントをもらえるお手伝いに参加できるようになったら、LINEからお伝えします💪"
      />
    </div>
  );
}
