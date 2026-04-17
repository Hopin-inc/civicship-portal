"use client";

import { VotePhaseBadge } from "@/shared/vote/components/VotePhaseBadge";
import { formatVotePeriod } from "@/shared/vote/utils/formatVotePeriod";
import { GqlVoteTopicPhase } from "@/types/graphql";

interface VoteDetailHeaderProps {
  title: string;
  phase: GqlVoteTopicPhase;
  startsAt: Date;
  endsAt: Date;
}

export function VoteDetailHeader({
  title,
  phase,
  startsAt,
  endsAt,
}: VoteDetailHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <h1 className="flex-1 text-xl font-bold leading-tight">{title}</h1>
        <VotePhaseBadge phase={phase} />
      </div>
      <p className="text-sm text-muted-foreground">
        {formatVotePeriod(startsAt, endsAt)}
      </p>
    </div>
  );
}
