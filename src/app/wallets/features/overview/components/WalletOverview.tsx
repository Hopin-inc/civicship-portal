"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useWalletContext } from "@/app/wallets/features/shared/contexts/WalletContext";

export function WalletOverview() {
  const router = useRouter();
  const {
    currentPoint,
    isLoading: isLoadingWallet,
    error: walletError,
    refresh,
  } = useWalletContext();

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
  if (walletError) return <ErrorState title={"ウォレット"} />;

  return (
    <div className="space-y-6">
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
    </div>
  );
}
