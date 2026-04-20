"use client";

import { useTranslations } from "next-intl";
import { VoteTallyBar } from "./VoteTallyBar";
import { computeVoteTally } from "../utils/computeVoteTally";

interface TallyOption {
  label: string;
  voteCount: number | null;
  totalPower: number | null;
}

interface VoteTallyListProps {
  options: TallyOption[];
  usePower: boolean;
}

export function VoteTallyList({ options, usePower }: VoteTallyListProps) {
  const t = useTranslations();
  const { items, totalVoters, totalPower } = computeVoteTally(options, usePower);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <VoteTallyBar
            key={item.label}
            label={item.label}
            percent={item.percent}
            count={usePower ? item.power : item.count}
            isWinner={item.isWinner}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{t("votes.results.totalVoters", { count: totalVoters })}</span>
        {usePower && totalPower !== totalVoters && (
          <>
            <span>·</span>
            <span>{t("votes.results.totalPower", { power: totalPower })}</span>
          </>
        )}
      </div>
    </div>
  );
}
