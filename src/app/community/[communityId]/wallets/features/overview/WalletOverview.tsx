"use client";

import React, { useMemo, useState } from "react";
import { useAppRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import { Button } from "@/components/ui/button";
import { Gift, QrCode } from "lucide-react";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useWalletContext } from "@/app/community/[communityId]/wallets/features/shared/contexts/WalletContext";
import { ReceiveQRSheet } from "@/app/community/[communityId]/wallets/features/receive/components/ReceiveQRSheet";

export function WalletOverview() {
  const router = useAppRouter();
  const t = useTranslations();
  const { currentPoint, userId, isLoadingWallet, error, refresh } = useWalletContext();
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

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
    router.push("/wallets/donate?tab=history");

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

      <div className="flex justify-center gap-3">
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
        <Button
          onClick={() => setIsReceiveOpen(true)}
          variant="secondary"
          size="sm"
          className="h-12 px-4"
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span className="text-base whitespace-nowrap">{t("wallets.overview.receiveButton")}</span>
        </Button>
      </div>

      <ReceiveQRSheet
        userId={userId ?? ""}
        open={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
      />
    </div>
  );
}
