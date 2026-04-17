"use client";

import { useTranslations } from "next-intl";
import { VoteDetailHeader } from "./VoteDetailHeader";
import { VoteDetailOptionsSection } from "./VoteDetailOptionsSection";
import { VoteDetailGateSection } from "./VoteDetailGateSection";
import { VoteDetailPowerPolicySection } from "./VoteDetailPowerPolicySection";
import type { VoteDetailView } from "../types/VoteDetailView";

interface VoteDetailProps {
  view: VoteDetailView;
}

export function VoteDetail({ view }: VoteDetailProps) {
  const t = useTranslations();

  return (
    <div className="px-4 max-w-md mx-auto py-6 space-y-6 pb-28">
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
      <VoteDetailGateSection gate={view.gate} />
      <VoteDetailPowerPolicySection powerPolicy={view.powerPolicy} />
    </div>
  );
}
