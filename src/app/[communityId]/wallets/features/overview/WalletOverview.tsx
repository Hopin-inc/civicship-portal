"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useWalletContext } from "@/app/[communityId]/wallets/features/shared/contexts/WalletContext";

export function WalletOverview() {
  const router = useRouter();
  const t = useTranslations();
  const { currentPoint, isLoadingWallet, error, refresh } = useWalletContext();

  const headerConfig = useMemo(
    () => ({
      title: t("wallets.overview.headerTitle"),
      showBackButton: true,
      showLogo: false,
      backTo: "/users/me",
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const handleNavigateToGive = () =>
    router.push(`/wallets/donate?currentPoint=${currentPoint}&tab=history`);

  if (isLoadingWallet) return <LoadingIndicator />;
  if (error) return <ErrorState title={t("wallets.overview.errorTitle")} />;

  return (
    <div className="space-y-6">
      <WalletCard
        currentPoint={currentPoint}
        isLoading={isLoadingWallet}
        onRefetch={async () => {
          try {
            await refresh();
            toast.success(t("wallets.overview.refreshSuccess"));
          } catch (err) {
            toast.error(t("wallets.overview.refreshError"));
          }
        }}
      />

      <div className="flex justify-center">
        <Button
          onClick={handleNavigateToGive}
          variant="secondary"
          size="sm"
          disabled={currentPoint <= 0}
          className="h-12 px-4"
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span className="text-base whitespace-nowrap">{t("wallets.overview.giveButton")}</span>
        </Button>
      </div>
    </div>
  );
}
