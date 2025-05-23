"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

const settings = [
  {
    title: "権限管理",
    description: "メンバーの役割を設定します",
    href: "/admin/members",
  },
  {
    title: "ウォレット管理",
    description: "ポイントの発行・支給などを行います",
    href: "/admin/wallet",
  },
  {
    title: "チケット管理",
    description: "チケットを発行できます",
    href: "/admin/tickets",
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
    <div className="max-w-xl mx-auto mt-8 space-y-2 px-4">
      {settings.map((item) => (
        <Card
          key={item.href}
          onClick={() => router.push(item.href)}
          className="cursor-pointer hover:bg-background-hover transition"
        >
          <CardHeader className={"text-body-sm font-bold"}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
