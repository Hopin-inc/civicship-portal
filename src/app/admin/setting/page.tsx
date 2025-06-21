"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Ticket, Users, Wallet, ClipboardList } from "lucide-react";

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
  },
  {
    title: "募集を選ぶ",
    href: "/admin/credentials",
    icon: ClipboardList,
  },
];

const operatorSettings = [
  {
    title: "チケット管理",
    href: "/admin/tickets",
    icon: Ticket,
  },
];

export default function SettingsPage() {
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "設定一覧",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      {/* 管理者専用セクション */}
      <section>
        <h2 className="text-sm text-muted-foreground font-semibold mb-2">管理者</h2>
        <div className="space-y-2">
          {adminSettings.map((item) => (
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
          ))}
        </div>
      </section>

      {/* 運用担当者も可セクション */}
      <section>
        <h2 className="text-sm text-muted-foreground font-semibold mb-2">運用担当者</h2>
        <div className="space-y-2">
          {operatorSettings.map((item) => (
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
          ))}
        </div>
      </section>
    </div>
  );
}
