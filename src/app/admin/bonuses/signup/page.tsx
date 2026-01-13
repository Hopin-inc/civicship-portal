"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Item } from "@/components/ui/item";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useQuery } from "@apollo/client";
import { GqlCommunitySignupBonusConfig, GqlSignupBonus } from "@/types/graphql";
import { cn } from "@/lib/utils";
import {
  GET_FAILED_SIGNUP_BONUSES,
  GET_SIGNUP_BONUS_CONFIG,
} from "@/graphql/account/community/query";
import FailedBonusItem from "../components/FailedBonusItem";
import Link from "next/link";
import EditBonusSheet from "@/app/admin/bonuses/components/EditBonusSheet";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GetSignupBonusConfigData {
  community: {
    id: string;
    config: {
      signupBonusConfig: GqlCommunitySignupBonusConfig | null;
    } | null;
  } | null;
}

interface GetFailedSignupBonusesData {
  signupBonuses: GqlSignupBonus[];
}

export default function SignupBonusDetailPage() {
  const t = useTranslations();

  const { data, loading, refetch } = useQuery<GetSignupBonusConfigData>(GET_SIGNUP_BONUS_CONFIG, {
    variables: { communityId: COMMUNITY_ID },
  });

  const { data: failedData, refetch: refetchFailed } = useQuery<GetFailedSignupBonusesData>(
    GET_FAILED_SIGNUP_BONUSES,
    {
      variables: { communityId: COMMUNITY_ID },
      // user が null のアイテムがある場合でも、エラーを無視して利用可能なデータを返す
      errorPolicy: "all",
    },
  );

  const config = data?.community?.config?.signupBonusConfig;
  // user が null のアイテムをフィルタリング
  const failedBonuses = (failedData?.signupBonuses ?? []).filter(
    (bonus) => bonus.user !== null && bonus.user !== undefined
  );

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

  const handleRetrySuccess = () => {
    refetch();
    refetchFailed();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">読み込み中...</div>
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
            {failedBonuses.map((bonus, index) => (
              <React.Fragment key={bonus.id}>
                {index > 0 && <hr className="border-muted" />}
                <FailedBonusItem bonus={bonus} onRetrySuccess={handleRetrySuccess} />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
