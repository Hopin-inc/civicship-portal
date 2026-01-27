"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-background px-8 pt-6">
      <div className="relative max-w-mobile-l mx-auto w-full">
        <div className="flex flex-col items-start">
          <div className="flex items-center w-full gap-3">
            <div className="flex items-center gap-3 flex-grow min-w-0">
              <div className="p-2 rounded-sm border bg-background flex-shrink-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={squareLogoPath} alt={title} />
                  <AvatarFallback className="rounded-sm bg-muted text-xs">
                    {title?.[0]?.toUpperCase() ?? "C"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h2 className="text-title-sm truncate">{title}</h2>
            </div>
            <Link href="/admin/settings" className="flex-shrink-0">
              <Button
                variant="icon-only"
                size="icon"
                className="text-foreground hover:bg-muted rounded-full"
                aria-label={t("adminSettings.header.settingsButton")}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
