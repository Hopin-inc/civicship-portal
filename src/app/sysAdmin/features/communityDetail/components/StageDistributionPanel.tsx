import React from "react";
import type { GqlSysAdminStageDistribution } from "@/types/graphql";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { StageDot, STAGE_KEYS, type StageKey } from "@/app/sysAdmin/_shared/components/StageColors";
import { StageProgressBar } from "@/app/sysAdmin/_shared/components/StageProgressBar";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  stages: GqlSysAdminStageDistribution | null;
};

/**
 * ステージ分布を 2 行 (ProgressBar + stage × 4 の horizontal summary) に
 * 圧縮。旧実装の 4 行詳細 (avg 送付率/avg 月数 etc) は情報量多すぎて
 * dashboard 概況の密度を損なうため廃止。詳細は必要なら MemberListPanel
 * で個別確認できる。
 */
export function StageDistributionPanel({ stages }: Props) {
  const labels = sysAdminDashboardJa.detail.stages;

  if (!stages) {
    return (
      <section className="flex flex-col gap-2">
        <header className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{labels.title}</h3>
          <MetricInfoButton metricKey="stages" />
        </header>
        <div className="min-h-[80px]" />
      </section>
    );
  }

  const counts: Record<StageKey, number> = {
    habitual: stages.habitual.count,
    regular: stages.regular.count,
    occasional: stages.occasional.count,
    latent: stages.latent.count,
  };

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-2">
        <h3 className="text-base font-semibold">{labels.title}</h3>
        <MetricInfoButton metricKey="stages" />
      </header>

      <StageProgressBar counts={counts} showLabels={false} />

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        {STAGE_KEYS.map((stage) => (
          <li key={stage} className="inline-flex items-baseline gap-1.5 tabular-nums">
            <StageDot stage={stage} />
            <span className="text-muted-foreground">{labels[stage]}</span>
            <span className="font-medium">{toIntJa(counts[stage])}</span>
            <span className="text-xs text-muted-foreground">
              ({toPct(counts[stage] / Math.max(1, counts.habitual + counts.regular + counts.occasional + counts.latent))})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
