"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useQuery } from "@apollo/client";
import {
  GqlCommunitySignupBonusConfig,
  GqlIncentiveGrant,
  useGetSignupBonusConfigQuery,
} from "@/types/graphql";
import { cn } from "@/lib/utils";
import { GET_FAILED_INCENTIVE_GRANTS } from "@/graphql/account/community/query";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GetSignupBonusConfigData {
  community: {
    id: string;
    config: {
      signupBonusConfig: GqlCommunitySignupBonusConfig | null;
    } | null;
  } | null;
}

interface GetFailedSignupBonusesData {
  incentiveGrants: {
    edges: Array<{
      node: GqlIncentiveGrant;
    }>;
  };
}

export default function BonusesPage() {
  const t = useTranslations();

  const headerConfig = useMemo(
    () => ({
      title: t("adminBonuses.page.title"),
      showBackButton: true,
      backTo: "/admin",
      showLogo: false,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useGetSignupBonusConfigQuery({
    variables: { communityId: COMMUNITY_ID },
  });

  const { data: failedData } = useQuery<GetFailedSignupBonusesData>(GET_FAILED_INCENTIVE_GRANTS, {
    variables: { communityId: COMMUNITY_ID },
    // user が null のアイテムがある場合でも、エラーを無視して利用可能なデータを返す
    errorPolicy: "all",
  });

  const config = data?.signupBonusConfig;
  // user が null のアイテムをフィルタリングしてカウント
  const failedCount = (failedData?.incentiveGrants?.edges ?? []).filter(
    (edge) => edge.node.user != null,
  ).length;

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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex flex-col">
        {/* 新規加入特典 */}
        <Item asChild>
          <Link href="/admin/bonuses/signup" className="flex flex-1 gap-3">
            <div className="flex flex-1 flex-col min-w-0">
              <ItemContent>
                <ItemTitle className="font-bold text-base leading-snug flex items-center gap-2">
                  {t("adminWallet.settings.signupBonus.title")}
                  {failedCount > 0 && (
                    <Badge variant="destructive" size="sm">
                      {t("adminWallet.settings.signupBonus.alert")}
                    </Badge>
                  )}
                </ItemTitle>
              </ItemContent>

              <ItemFooter className="mt-2">
                <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
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
              </ItemFooter>
            </div>

            {/* 右側にChevronアイコン */}
            <div className="shrink-0 flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </Item>

        {/* 区切り線 */}
        <hr className="border-muted" />

        {/* 累計獲得pt特典（将来機能） */}
        <Item>
          <div className="flex flex-1 flex-col min-w-0">
            <ItemContent>
              <ItemTitle className="font-bold text-base leading-snug">
                {t("adminBonuses.cumulative.title")}
              </ItemTitle>
            </ItemContent>

            <ItemFooter className="mt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                <span className="flex items-center gap-1">
                  {/* ステータス表示は将来実装予定 */}
                  {/* <span className={cn("size-2.5 rounded-full", "bg-green-500")} /> */}
                  {/* 有効 ・ */}
                  {t("adminBonuses.cumulative.reward")}
                </span>
              </div>
            </ItemFooter>
          </div>

          {/* 右端の編集ボタン（準備中） */}
          <div className="shrink-0 flex items-center">
            <Button variant="tertiary" size="sm" disabled>
              {t("adminBonuses.cumulative.preparing")}
            </Button>
          </div>
        </Item>
      </div>
    </div>
  );
}
