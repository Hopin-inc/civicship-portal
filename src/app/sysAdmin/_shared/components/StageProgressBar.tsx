import React from "react";
import { cn } from "@/lib/utils";
import { STAGE_BG_COLORS, STAGE_KEYS, type StageKey } from "./StageColors";

type StageCounts = Record<StageKey, number>;

type Props = {
  counts: StageCounts;
  showLabels?: boolean;
  className?: string;
};

export function computeStagePercentages(counts: StageCounts): Record<StageKey, number> {
  const total = STAGE_KEYS.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
  if (total === 0) {
    return { habitual: 0, regular: 0, occasional: 0, latent: 0 };
  }
  return {
    habitual: (counts.habitual / total) * 100,
    regular: (counts.regular / total) * 100,
    occasional: (counts.occasional / total) * 100,
    latent: (counts.latent / total) * 100,
  };
}

export function StageProgressBar({ counts, showLabels = true, className }: Props) {
  const pct = computeStagePercentages(counts);
  const total = STAGE_KEYS.reduce((sum, k) => sum + (counts[k] ?? 0), 0);

  return (
    <div className={className}>
      <div
        className="flex h-3 w-full overflow-hidden rounded-full"
        role="img"
        aria-label="ステージ分布"
      >
        {total === 0 ? (
          <div className="h-full w-full bg-slate-100" />
        ) : (
          STAGE_KEYS.map((stage) => (
            <div
              key={stage}
              className={cn("h-full", STAGE_BG_COLORS[stage])}
              style={{ width: `${pct[stage]}%` }}
            />
          ))
        )}
      </div>
      {showLabels && (
        <div className="mt-1 flex justify-between text-xs tabular-nums text-muted-foreground">
          {STAGE_KEYS.map((stage) => (
            <span key={stage}>{pct[stage].toFixed(1)}%</span>
          ))}
        </div>
      )}
    </div>
  );
}
