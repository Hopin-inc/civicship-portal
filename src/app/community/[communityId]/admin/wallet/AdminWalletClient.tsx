"use client";

import React, { useTransition, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import { GqlMembership, GqlRole, GqlTransactionsConnection } from "@/types/graphql";
import { Coins, Gift } from "lucide-react";
import { toast } from "react-toastify";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { AppLink, useAppRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface Props {
  initialWallet: { id: string; currentPoint: number };
  initialTransactions: GqlTransactionsConnection;
}

export function AdminWalletClient({ initialWallet, initialTransactions }: Props) {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const { user: currentUser } = useAuth();
  const currentUserRole = currentUser?.memberships?.find(
    (m: GqlMembership) => m.community?.id === communityId,
  )?.role;

  const router = useAppRouter();
  const [isPending, startTransition] = useTransition();

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.title"),
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const handleRefetch = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleOnRefetch = async () => {
    try {
      handleRefetch();
      toast.success(t("adminWallet.toast.refreshSuccess"));
    } catch {
      toast.error(t("adminWallet.toast.refreshError"));
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto mt-8 px-4">
      <WalletCard
        currentPoint={initialWallet.currentPoint}
        isLoading={isPending}
        onRefetch={handleOnRefetch}
      />

      <div className="flex justify-center items-center gap-x-3">
        <Button
          disabled={currentUserRole !== GqlRole.Owner}
          onClick={() => router.push("/admin/wallet/issue")}
          variant="secondary"
          size="sm"
          className="h-12 px-4"
        >
          <Coins className="w-4 h-4 shrink-0" />
          <span className="text-base whitespace-nowrap">{t("adminWallet.buttons.issue")}</span>
        </Button>
        <Button
          disabled={currentUserRole !== GqlRole.Owner || initialWallet.currentPoint <= 0}
          onClick={() => router.push("/admin/wallet/grant?tab=history")}
          variant="secondary"
          size="sm"
          className="h-12 px-4"
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span className="text-base whitespace-nowrap">{t("adminWallet.buttons.grant")}</span>
        </Button>
      </div>

      <div className="pt-10 flex justify-between items-center">
        <h2 className="text-display-sm">{t("transactions.list.title")}</h2>
        <AppLink
          href="/transactions"
          className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
        >
          {t("transactions.list.communityHistoryLink")}
        </AppLink>
      </div>
      <div className="mt-2">
        {initialTransactions.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            {t("transactions.list.emptyState")}
          </p>
        ) : (
          <InfiniteTransactionList
            initialTransactions={initialTransactions}
            walletId={initialWallet.id}
            perspectiveWalletId={initialWallet.id}
            showSignedAmount={true}
            showDid={true}
            enableClickNavigation={true}
          />
        )}
      </div>
    </div>
  );
}
