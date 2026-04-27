"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";

const systemSettings = [
  {
    title: "テンプレート",
    description: "レポート生成・評価の AI プロンプトを管理します",
    href: "/sysAdmin/system/templates",
    icon: Sparkles,
  },
];

export default function SysAdminSystemPage() {
  const router = useAppRouter();

  const headerConfig = useMemo(
    () => ({
      title: "システム設定",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <section>
        <div className="space-y-2">
          {systemSettings.map((item) => (
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
                <p className="text-body-sm text-muted-foreground pl-6">
                  {item.description}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
