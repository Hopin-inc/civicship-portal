"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * 管理画面のポータルヘッダーコンポーネント
 * コミュニティの正方形ロゴとタイトルを表示し、右側に「設定」ボタンを配置
 */
export function AdminPortalHeader() {
  const communityConfig = useCommunityConfig();
  const t = useTranslations();

  if (!communityConfig) {
    return null;
  }

  const { title, squareLogoPath } = communityConfig;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-md">
          <AvatarImage src={squareLogoPath} alt={title} />
          <AvatarFallback className="rounded-md bg-muted">
            {title?.[0]?.toUpperCase() ?? "C"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <Link href="/admin/settings">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          {t("adminSettings.header.settingsButton")}
        </Button>
      </Link>
    </div>
  );
}
