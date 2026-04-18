"use client";

import { useTranslations } from "next-intl";
import { VotePhaseBadge } from "@/shared/vote/components/VotePhaseBadge";
import { formatVotePeriod } from "@/shared/vote/utils/formatVotePeriod";
import { VoteCastViewModel } from "../types/VoteCastViewModel";
import { VoteCastForm } from "./VoteCastForm";
import { VoteUpcomingNotice } from "./VoteUpcomingNotice";
import { VoteClosedNotice } from "./VoteClosedNotice";
import { VoteEligibilityNotice } from "./VoteEligibilityNotice";

interface VoteCastPageProps {
  view: VoteCastViewModel;
}

export function VoteCastPage({ view }: VoteCastPageProps) {
  const t = useTranslations();

  return (
    <div className="px-4 max-w-md mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <VotePhaseBadge phase={view.phase} className="w-fit" />
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
        <VoteEligibilityNotice reason={view.reason} />
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
