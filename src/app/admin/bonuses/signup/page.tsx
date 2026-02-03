"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Item } from "@/components/ui/item";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetFailedIncentiveGrantsQuery, useGetSignupBonusConfigQuery } from "@/types/graphql";
import { cn } from "@/lib/utils";
import FailedBonusItem from "../components/FailedBonusItem";
import Link from "next/link";
import EditBonusSheet from "@/app/admin/bonuses/components/EditBonusSheet";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupBonusDetailPage() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const { data, loading, error, refetch } = useGetSignupBonusConfigQuery({
    variables: { communityId: communityId ?? "" },
    skip: !communityId,
  });

  const { data: failedData, refetch: refetchFailed } = useGetFailedIncentiveGrantsQuery({
    variables: { communityId: communityId ?? "" },
    skip: !communityId,
    // user が null のアイテムがある場合でも、エラーを無視して利用可能なデータを返す
    errorPolicy: "all",
  });

  const config = data?.signupBonusConfig;
  // user が null のアイテムをフィルタリング
  const failedBonuses = (failedData?.incentiveGrants?.edges ?? [])
    .filter((edge) => edge?.node?.user != null)
    .map((edge) => edge?.node);

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.settings.signupBonus.title"),
      showBackButton: true,
      backTo: "/admin/bonuses",
      showLogo: false,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const handleRetrySuccess = async () => {
    await Promise.all([refetch(), refetchFailed()]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="text-sm font-medium">{t("common.errorState.defaultTitle")}</div>
        <div className="text-xs text-muted-foreground text-center max-w-md">
          {t("common.errorState.description")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-2">
      {/* Configuration Display */}
      <Item>
        <div className="flex flex-1 items-center justify-between min-w-0 gap-4">
          <div className="text-sm text-foreground flex items-center gap-2 truncate">
            <span className="flex items-center gap-1">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  config?.isEnabled ? "bg-green-500" : "bg-muted-foreground",
                )}
                aria-label={
                  config?.isEnabled
                    ? t("adminWallet.settings.signupBonus.statusEnabled")
                    : t("adminWallet.settings.signupBonus.statusDisabled")
                }
              />
              {config?.isEnabled
                ? t("adminWallet.settings.signupBonus.statusEnabled")
                : t("adminWallet.settings.signupBonus.statusDisabled")}
              ・
              {t("adminWallet.settings.signupBonus.points", {
                points: config?.bonusPoint ?? 0,
              })}
            </span>
          </div>
          <EditBonusSheet
            currentConfig={config}
            onSave={() => {
              refetch();
            }}
          />
        </div>
      </Item>

      {/* Success or Failed Bonuses Section */}
      {failedBonuses.length === 0 ? (
        <div className="p-4">
          <div className="text-sm text-center space-y-3">
            <div className="font-medium text-green-600 flex items-center justify-center gap-2">
              <CheckCircle2 className="size-5" />
              {t("adminWallet.settings.signupBonus.details.allGood")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("adminWallet.settings.signupBonus.details.seeTransactions")}
            </div>
            <Button variant="text" size="sm" asChild>
              <Link href="/admin/wallet">
                {t("adminWallet.settings.signupBonus.details.viewWallet")}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t("adminWallet.settings.pending.title")}</h2>
            <span className="text-xs text-muted-foreground">
              {t("adminWallet.settings.pending.count", { count: failedBonuses.length })}
            </span>
          </div>

          <div className="flex flex-col border rounded-lg">
            {failedBonuses.map(
              (bonus, index) =>
                bonus && (
                  <React.Fragment key={bonus.id}>
                    {index > 0 && <hr className="border-muted" />}
                    <FailedBonusItem bonus={bonus} onRetrySuccess={handleRetrySuccess} />
                  </React.Fragment>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
