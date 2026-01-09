"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { gql, useQuery } from "@apollo/client";
import EditBonusSheet from "./components/EditBonusSheet";
import { GqlCommunitySignupBonusConfig } from "@/types/graphql";

const GET_SIGNUP_BONUS_CONFIG = gql`
  query GetSignupBonusConfig($communityId: ID!) {
    community(id: $communityId) {
      id
      config {
        signupBonusConfig {
          bonusPoint
          isEnabled
          message
        }
      }
    }
  }
`;

interface GetSignupBonusConfigData {
  community: {
    id: string;
    config: {
      signupBonusConfig: GqlCommunitySignupBonusConfig | null;
    } | null;
  } | null;
}

export default function SignupBonusSettingsPage() {
  const t = useTranslations();

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.settings.title"),
      showBackButton: true,
      backTo: "/admin/wallet",
    }),
    [t]
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
    <div className="space-y-8 px-4 mt-6 max-w-xl mx-auto">
      <section className="space-y-4">
        <Card className="p-2">
          <ItemGroup>
            <Item size="sm">
              <ItemContent>
                <ItemTitle className="text-base font-bold">
                  {t("adminWallet.settings.signupBonus.title")}
                </ItemTitle>
                <ItemDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-display font-bold">
                      {t("adminWallet.settings.signupBonus.points", {
                        points: config?.bonusPoint ?? 0,
                      })}
                    </span>
                    <Badge variant={config?.isEnabled ? "default" : "secondary"}>
                      {config?.isEnabled
                        ? t("adminWallet.settings.signupBonus.statusEnabled")
                        : t("adminWallet.settings.signupBonus.statusDisabled")}
                    </Badge>
                  </div>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <EditBonusSheet currentConfig={config} onSave={() => refetch()} />
              </ItemActions>
            </Item>
          </ItemGroup>
        </Card>
      </section>
    </div>
  );
}
