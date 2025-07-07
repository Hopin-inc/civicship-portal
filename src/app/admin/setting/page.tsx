"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ClipboardList, Ticket, Users, Wallet } from "lucide-react";
import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";
import { useAdminRole } from "@/app/admin/context/AdminRoleContext";
import { GqlRole } from "@/types/graphql";

const adminSettings = [
  {
    title: "権限管理",
    href: "/admin/members",
    icon: Users,
  },
  {
    title: "ウォレット管理",
    href: "/admin/wallet",
    icon: Wallet,
    requiredFeature: "points" as FeaturesType,
  },
  {
    title: "証明書管理",
    href: "/admin/credentials",
    icon: ClipboardList,
    requiredFeature: "credentials" as FeaturesType,
  },
];

const operatorSettings = [
  {
    title: "チケット管理",
    href: "/admin/tickets",
    icon: Ticket,
    requiredFeature: "tickets" as FeaturesType,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const role = useAdminRole();

  const headerConfig = useMemo(
    () => ({
      title: "設定一覧",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const enabled = currentCommunityConfig.enableFeatures;

  const visibleAdminSettings =
    role === GqlRole.Owner
      ? adminSettings.filter(
          (item) => !item.requiredFeature || enabled.includes(item.requiredFeature),
        )
      : [];
  const visibleOperatorSettings =
    role === GqlRole.Owner || role === GqlRole.Manager
      ? operatorSettings.filter(
          (item) => !item.requiredFeature || enabled.includes(item.requiredFeature),
        )
      : [];

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      {/* 管理者セクション */}
      <section>
        <h2 className="text-sm text-muted-foreground font-semibold mb-2">管理者</h2>
        <div className="space-y-2">
          {visibleAdminSettings.length > 0 ? (
            visibleAdminSettings.map((item) => (
              <Card
                key={item.href}
                onClick={() => router.push(item.href)}
                className="cursor-pointer hover:bg-background-hover transition"
              >
                <CardHeader>
                  <CardTitle className="text-body-sm font-bold flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">表示できる設定項目はありません。</p>
          )}
        </div>
      </section>

      {/* 運用担当者セクション */}
      <section>
        <h2 className="text-sm text-muted-foreground font-semibold mb-2">運用担当者</h2>
        <div className="space-y-2">
          {visibleOperatorSettings.length > 0 ? (
            visibleOperatorSettings.map((item) => (
              <Card
                key={item.href}
                onClick={() => router.push(item.href)}
                className="cursor-pointer hover:bg-background-hover transition"
              >
                <CardHeader>
                  <CardTitle className="text-body-sm font-bold flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">表示できる設定項目はありません。</p>
          )}
        </div>
      </section>
    </div>
  );
}
