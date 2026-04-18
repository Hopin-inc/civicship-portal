"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VotePhaseBadge } from "@/shared/vote/components/VotePhaseBadge";
import { formatVotePeriod } from "@/shared/vote/utils/formatVotePeriod";
import { VoteCastViewModel } from "../types/VoteCastViewModel";
import { VoteCastForm } from "./VoteCastForm";
import { VoteUpcomingNotice } from "./VoteUpcomingNotice";
import { VoteClosedNotice } from "./VoteClosedNotice";
import { VoteEligibilityNotice } from "./VoteEligibilityNotice";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}日 ${hours}時間`;
  if (hours > 0) return `${hours}時間 ${minutes}分`;
  return `${minutes}分`;
}

function useRemainingTime(endsAt: Date, phase: GqlVoteTopicPhase): string | null {
  const [remaining, setRemaining] = useState<string | null>(null);
  useEffect(() => {
    if (phase !== GqlVoteTopicPhase.Open) {
      setRemaining(null);
      return;
    }
    const update = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setRemaining(null);
        return;
      }
      setRemaining(formatRemaining(ms));
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [endsAt, phase]);
  return remaining;
}

interface VoteCastPageProps {
  view: VoteCastViewModel;
}

export function VoteCastPage({ view }: VoteCastPageProps) {
  const t = useTranslations();
  const remaining = useRemainingTime(view.endsAt, view.phase);

  return (
    <div className="px-4 max-w-md mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <VotePhaseBadge phase={view.phase} className="w-fit" />
          {remaining && (
            <span className="text-xs text-muted-foreground">
              {t("votes.cast.remaining", { time: remaining })}
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold leading-tight">{view.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatVotePeriod(view.startsAt, view.endsAt)}
        </p>
      </div>

      {view.description && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {view.description}
        </p>
      )}

      {view.displayMode === "upcoming" && (
        <VoteUpcomingNotice startsAt={view.startsAt} />
      )}

      {view.displayMode === "ineligible" && (
        <VoteEligibilityNotice reason={view.reason} gate={view.gate} />
      )}

      {view.displayMode === "cast" && (
        <VoteCastForm
          topicId={view.topicId}
          options={view.options}
          currentPower={view.currentPower}
          myBallotOptionId={view.myBallotOptionId}
        />
      )}

      {view.displayMode === "closed" && (
        <VoteClosedNotice
          myBallotLabel={view.myBallotLabel}
          myBallotPower={view.myBallotPower}
        />
      )}
    </div>
  );
}
