"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import {
  FileText,
  Image,
  Globe,
  Coins,
  ToggleLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminRole } from "@/app/admin/context/AdminRoleContext";
import { GqlRole } from "@/types/graphql";

type SettingItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const settingsItems: SettingItem[] = [
  {
    title: "基本情報",
    description: "ポータルのタイトル、説明文を設定",
    href: "/admin/settings/basic",
    icon: FileText,
  },
  {
    title: "ロゴ・画像",
    description: "ロゴ、OG画像、ファビコンを設定",
    href: "/admin/settings/images",
    icon: Image,
  },
  {
    title: "ドメイン",
    description: "ドメイン、ルートパスを設定",
    href: "/admin/settings/domain",
    icon: Globe,
  },
  {
    title: "トークン",
    description: "トークン名を設定",
    href: "/admin/settings/token",
    icon: Coins,
  },
  {
    title: "機能フラグ",
    description: "有効にする機能を選択",
    href: "/admin/settings/features",
    icon: ToggleLeft,
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const role = useAdminRole();

  const headerConfig = useMemo(
    () => ({
      title: "ポータル設定",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  // Ownerのみアクセス可能
  if (role !== GqlRole.Owner) {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <p className="text-muted-foreground text-sm">
          この設定にアクセスする権限がありません。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <section>
        <h2 className="text-sm text-muted-foreground font-semibold mb-2">
          ポータル設定
        </h2>
        <div className="space-y-2">
          {settingsItems.map((item) => (
            <Card
              key={item.href}
              onClick={() => router.push(item.href)}
              className="cursor-pointer hover:bg-background-hover transition"
            >
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-body-sm font-bold">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
