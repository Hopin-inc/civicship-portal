"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { VoteTallyList } from "@/shared/vote/components/VoteTallyList";

interface VoteClosedNoticeProps {
  myBallotLabel: string | null;
  myBallotPower: number | null;
  options: { label: string; voteCount: number | null; totalPower: number | null }[];
}

export function VoteClosedNotice({
  myBallotLabel,
  myBallotPower,
  options,
}: VoteClosedNoticeProps) {
  const t = useTranslations();
  const hasVoteData = options.some((o) => o.voteCount != null);
  const usePower = options.some(
    (o) => o.totalPower != null && o.voteCount != null && o.totalPower !== o.voteCount,
  );

  return (
    <div className="space-y-4">
      <Card className="text-center">
        <CardContent className="py-6 space-y-2">
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

      {hasVoteData && (
        <VoteTallyList options={options} usePower={usePower} />
      )}
    </div>
  );
}
