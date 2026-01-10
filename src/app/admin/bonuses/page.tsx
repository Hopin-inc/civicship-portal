"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Item, ItemContent, ItemTitle, ItemFooter } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useQuery } from "@apollo/client";
import EditBonusSheet from "./components/EditBonusSheet";
import { GqlCommunitySignupBonusConfig } from "@/types/graphql";
import { cn } from "@/lib/utils";
import { GET_SIGNUP_BONUS_CONFIG } from "@/graphql/account/community/query";

interface GetSignupBonusConfigData {
  community: {
    id: string;
    config: {
      signupBonusConfig: GqlCommunitySignupBonusConfig | null;
    } | null;
  } | null;
}

export default function BonusesPage() {
  const t = useTranslations();

  const headerConfig = useMemo(
    () => ({
      title: "特典一覧",
      showBackButton: true,
      backTo: "/admin",
      showLogo: false,
    }),
    []
  );
  useHeaderConfig(headerConfig);

  const { data, loading, refetch } = useQuery<GetSignupBonusConfigData>(
    GET_SIGNUP_BONUS_CONFIG,
    {
      variables: { communityId: COMMUNITY_ID },
    }
  );

  const config = data?.community?.config?.signupBonusConfig;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex flex-col">
        {/* 新規加入特典 */}
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

          {/* 右端の編集ボタン */}
          <div className="shrink-0 flex items-center">
            <EditBonusSheet currentConfig={config} onSave={() => refetch()} />
          </div>
        </Item>

        {/* 区切り線 */}
        <hr className="border-muted" />

        {/* 累計獲得pt特典（将来機能） */}
        <Item>
          <div className="flex flex-1 flex-col min-w-0">
            <ItemContent>
              <ItemTitle className="font-bold text-base leading-snug">
                累計獲得pt特典
              </ItemTitle>
            </ItemContent>

            <ItemFooter className="mt-2">
              <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                <span className="flex items-center gap-1">
                  {/* ステータス表示は将来実装予定 */}
                  {/* <span className={cn("size-2.5 rounded-full", "bg-green-500")} /> */}
                  {/* 有効 ・ */}
                  1SBT支給
                </span>
              </div>
            </ItemFooter>
          </div>

          {/* 右端の編集ボタン（準備中） */}
          <div className="shrink-0 flex items-center">
            <Button variant="outline" size="sm" disabled>
              準備中
            </Button>
          </div>
        </Item>
      </div>
    </div>
  );
}
