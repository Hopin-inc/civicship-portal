"use client";

import { useTranslations } from "next-intl";
import { ShieldX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { REASON_I18N_MAP } from "../constants/ineligibleReason";

interface VoteEligibilityNoticeProps {
  reason: string | null;
}

export function VoteEligibilityNotice({ reason }: VoteEligibilityNoticeProps) {
  const t = useTranslations();
  const reasonKey = reason && REASON_I18N_MAP[reason];

  return (
    <Card className="text-center">
      <CardContent className="py-8 space-y-3">
        <ShieldX className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-sm font-medium">{t("votes.eligibility.title")}</p>
        {reasonKey && (
          <p className="text-xs text-muted-foreground">{t(reasonKey)}</p>
        )}
      </CardContent>
    </Card>
  );
}
