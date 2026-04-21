"use client";

import { useTranslations } from "next-intl";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { VoteDetailHeader } from "./VoteDetailHeader";
import { VoteDetailOptionsSection } from "./VoteDetailOptionsSection";
import { VoteDetailRulesSection } from "./VoteDetailRulesSection";
import type { VoteDetailView } from "../types/VoteDetailView";
import { cn } from "@/lib/utils";

interface VoteDetailProps {
  view: VoteDetailView;
}

export function VoteDetail({ view }: VoteDetailProps) {
  const t = useTranslations();

  return (
    <div className={cn(
      "px-4 max-w-md mx-auto py-6 space-y-6",
      view.phase === GqlVoteTopicPhase.Upcoming && "pb-28",
    )}>
      <VoteDetailHeader
        title={view.title}
        phase={view.phase}
        startsAt={view.startsAt}
        endsAt={view.endsAt}
      />

      {view.description ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {view.description}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground/50 italic">
          {t("adminVotes.detail.noDescription")}
        </p>
      )}

      <VoteDetailOptionsSection options={view.options} />
      <VoteDetailRulesSection gate={view.gate} powerPolicy={view.powerPolicy} />
    </div>
  );
}
