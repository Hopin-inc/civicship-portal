"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VoteClosedNoticeProps {
  myBallotLabel: string | null;
  myBallotPower: number | null;
}

export function VoteClosedNotice({
  myBallotLabel,
  myBallotPower,
}: VoteClosedNoticeProps) {
  const t = useTranslations();

  return (
    <Card className="text-center">
      <CardContent className="py-8 space-y-3">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm font-medium">{t("votes.closed.message")}</p>
        {myBallotLabel && (
          <p className="text-xs text-muted-foreground">
            {t("votes.closed.myBallot", {
              label: myBallotLabel,
              power: myBallotPower ?? 1,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
