"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { Flag, HelpCircleIcon, LifeBuoy, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HelpSection() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="flex items-center justify-between py-4 px-4 border-b">
        <div className="flex items-center gap-2">
            <HelpCircleIcon className="w-5 h-5" />
            <span className="font-bold text-sm flex items-center gap-2">
                {t("users.settings.help.howToUse", { communityName: communityConfig?.title ?? "" })}
            </span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <TrashIcon className="w-5 h-5" />
                <span className="font-bold text-sm">{t("users.settings.help.clearCache")}</span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                <span className="font-bold text-sm">{t("users.settings.help.reportBug")}</span>
            </div>
        </div>
        <div className="flex items-center justify-between py-4 px-4 border-b">
            <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5" />
                <span className="font-bold text-sm">{t("users.settings.help.supportChat")}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
