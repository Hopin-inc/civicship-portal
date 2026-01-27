"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useAuth } from "@/contexts/AuthProvider";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import WalletCard from "@/components/shared/WalletCard";
import { GqlMembership, GqlRole, GqlWallet, useGetCommunityWalletQuery } from "@/types/graphql";
import { Coins, Gift } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { toast } from "react-toastify";
import useCommunityTransactions from "@/app/[communityId]/admin/wallet/hooks/useCommunityTransactions";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { logger } from "@/lib/logging";
import CommunityLink from "@/components/navigation/CommunityLink";
import { toPointNumber } from "@/utils/bigint";
import { useTranslations } from "next-intl";

export default function WalletPage() {
  const t = useTranslations();
  const config = useCommunityConfig();
  const communityId = config?.communityId ?? "";
  const { user: currentUser } = useAuth();
  const currentUserRole = currentUser?.memberships?.find(
    (m: GqlMembership) => m.community?.id === communityId,
  )?.role;

  const router = useCommunityRouter();
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

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

  const handleNavigateToIssue = () => router.push("/admin/wallet/issue");
  const handleNavigateToGrant = () =>
    router.push(`/admin/wallet/grant?currentPoint=${currentPoint}&tab=history`);

  const {
    data: walletData,
    loading: loadingWallet,
    refetch: refetchWallet,
  } = useGetCommunityWalletQuery({
    variables: {
      communityId,
    },
  });

  const wallet: GqlWallet | undefined | null = walletData?.wallets.edges?.find(
    (w) => w?.node?.community?.id === communityId,
  )?.node;
  const walletId = wallet?.id ?? "";
  const currentPointView = wallet?.currentPointView;
  const currentPoint = toPointNumber(currentPointView?.currentPoint, 0);

  const { connection, refetch: refetchTransactions } = useCommunityTransactions();

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
          logger.warn("Refresh failed after redirect", {
            error: err instanceof Error ? err.message : String(err),
            component: "WalletPage",
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
        logger.warn("Refetch failed on window focus", {
          error: err instanceof Error ? err.message : String(err),
          component: "WalletPage",
        });
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
            toast.success(t("adminWallet.toast.refreshSuccess"));
          } catch (err) {
            toast.error(t("adminWallet.toast.refreshError"));
          }
        }}
      />

      <div className="flex justify-center items-center gap-x-3">
        <Button
          disabled={currentUserRole !== GqlRole.Owner}
          onClick={handleNavigateToIssue}
          variant="secondary"
          size="sm"
          className="h-12 px-4"
        >
          <Coins className="w-4 h-4 shrink-0" />
          <span className="text-base whitespace-nowrap">{t("adminWallet.buttons.issue")}</span>
        </Button>
        <Button
          disabled={currentUserRole !== GqlRole.Owner || currentPoint <= 0}
          onClick={handleNavigateToGrant}
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
        <CommunityLink
          href="/transactions"
          className="text-sm border-b-[1px] border-black cursor-pointer bg-transparent p-0"
        >
          {t("transactions.list.communityHistoryLink")}
        </CommunityLink>
      </div>
      <div className="mt-2">
        {connection.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            {t("transactions.list.emptyState")}
          </p>
        ) : (
          <InfiniteTransactionList
            initialTransactions={connection}
            walletId={walletId}
            perspectiveWalletId={walletId}
            showSignedAmount={true}
            showDid={true}
            enableClickNavigation={true}
          />
        )}
      </div>
    </div>
  );
}
