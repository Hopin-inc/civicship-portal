"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Contact, Globe } from "lucide-react";
import Link from "next/link";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export default function SettingSection() {
  const t = useTranslations();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        {/* プロフィール設定 */}
        <div className="flex items-center justify-between py-4 px-4 border-b">
          <div className="flex items-center gap-2">
            <Contact className="w-5 h-5" />
            <span className="font-bold text-sm">{t("users.settings.profileLabel")}</span>
          </div>
          <Link
            href="/users/me/edit"
            className={cn(
              buttonVariants({ variant: "tertiary", size: "sm" }),
              "ml-auto text-black w-24",
            )}
          >
            {t("users.settings.editButton")}
          </Link>
        </div>

        {/* 言語切替 */}
        {communityConfig?.enableFeatures?.includes("languageSwitcher") && (
          <div className="flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span className="font-bold text-sm">{t("users.settings.languageLabel")}</span>
            </div>
            <LocaleSwitcher />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
