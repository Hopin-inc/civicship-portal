"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Item, ItemContent, ItemTitle, ItemFooter } from "@/components/ui/item";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useQuery } from "@apollo/client";
import { GqlCommunitySignupBonusConfig, GqlSignupBonus } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { GET_SIGNUP_BONUS_CONFIG, GET_FAILED_SIGNUP_BONUSES } from "@/graphql/account/community/query";
import EditBonusSheet from "../components/EditBonusSheet";
import FailedBonusItem from "../components/FailedBonusItem";
import Link from "next/link";

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

  const { data, loading, refetch } = useQuery<GetSignupBonusConfigData>(
    GET_SIGNUP_BONUS_CONFIG,
    {
      variables: { communityId: COMMUNITY_ID },
    }
  );

  const { data: failedData, refetch: refetchFailed } = useQuery<GetFailedSignupBonusesData>(
    GET_FAILED_SIGNUP_BONUSES,
    {
      variables: { communityId: COMMUNITY_ID },
    }
  );

  const config = data?.community?.config?.signupBonusConfig;
  const failedBonuses = failedData?.signupBonuses ?? [];

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.settings.signupBonus.title"),
      showBackButton: true,
      backTo: "/admin/bonuses",
      showLogo: false,
      action: config ? (
        <EditBonusSheet
          currentConfig={config}
          onSave={() => {
            refetch();
          }}
        />
      ) : null,
    }),
    [config, refetch, t]
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
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      {/* Configuration Display */}
      <div className="border rounded-lg">
        <Item>
          <div className="flex flex-1 flex-col min-w-0">
            <ItemContent>
              <ItemTitle className="font-bold text-base leading-snug">
                {t("adminWallet.settings.signupBonus.title")}
              </ItemTitle>
            </ItemContent>

            <ItemFooter className="mt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                <span className="flex items-center gap-1">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      config?.isEnabled ? "bg-green-500" : "bg-muted-foreground"
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
            </ItemFooter>
          </div>
        </Item>
      </div>

      {/* Success or Failed Bonuses Section */}
      {failedBonuses.length === 0 ? (
        <div className="border rounded-lg p-6">
          <div className="text-sm text-center space-y-2">
            <div className="font-medium">
              {t("adminWallet.settings.signupBonus.details.allGood")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("adminWallet.settings.signupBonus.details.seeTransactions")}
            </div>
            <Link
              href="/admin/wallet"
              className="inline-block text-xs text-primary hover:underline mt-2"
            >
              ウォレット管理を見る
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {t("adminWallet.settings.pending.title")}
            </h2>
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
