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
import { VoteGateInfoBanner } from "./VoteGateInfoBanner";

type Translator = ReturnType<typeof useTranslations>;

function formatRemaining(ms: number, t: Translator): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return t("votes.cast.remaining.daysHours", { days, hours });
  if (hours > 0) return t("votes.cast.remaining.hoursMinutes", { hours, minutes });
  return minutes > 0 ? t("votes.cast.remaining.minutes", { minutes }) : t("votes.cast.remaining.lessThanMinute");
}

function useRemainingTime(endsAt: Date, phase: GqlVoteTopicPhase, t: Translator): string | null {
  const [remaining, setRemaining] = useState<string | null>(null);
  useEffect(() => {
    if (phase !== GqlVoteTopicPhase.Open) {
      setRemaining(null);
      return;
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    const update = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) {
        setRemaining(null);
        if (timer) clearInterval(timer);
        return;
      }
      setRemaining(formatRemaining(ms, t));
    };
    update();
    timer = setInterval(update, 60_000);
    return () => { if (timer) clearInterval(timer); };
  }, [endsAt, phase]);
  return remaining;
}

interface VoteCastPageProps {
  view: VoteCastViewModel;
}

export function VoteCastPage({ view }: VoteCastPageProps) {
  const t = useTranslations();
  const remaining = useRemainingTime(view.endsAt, view.phase, t);

  return (
    <div className="px-4 max-w-md mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <VotePhaseBadge phase={view.phase} className="w-fit" />
          {remaining && (
            <span className="text-xs text-muted-foreground">
              {t("votes.cast.remainingLabel", { time: remaining })}
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
        <>
          <VoteGateInfoBanner gate={view.gate} />
          <VoteCastForm
            topicId={view.topicId}
            options={view.options}
            currentPower={view.currentPower}
            myBallotOptionId={view.myBallotOptionId}
          />
        </>
      )}

      {view.displayMode === "closed" && (
        <VoteClosedNotice
          myBallotLabel={view.myBallotLabel}
          myBallotPower={view.myBallotPower}
          options={view.options}
        />
      )}
    </div>
  );
}
