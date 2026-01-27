"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import CommunityLink from "@/components/navigation/CommunityLink";
import { useTranslations } from "next-intl";

export default function UpdateSection() {
  const t = useTranslations();

  return (
    <CommunityLink href="/update" className="block w-full max-w-md mx-auto">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 py-4 px-4">
            <FileText className="w-5 h-5" />
            <span className="font-bold text-sm">{t("users.settings.updatePageTitle")}</span>
          </div>
        </CardContent>
      </Card>
    </CommunityLink>
  );
}
