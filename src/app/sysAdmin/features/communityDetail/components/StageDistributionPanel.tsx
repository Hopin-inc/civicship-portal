import React from "react";
import type { GqlSysAdminStageDistribution } from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { StageDot, STAGE_KEYS, type StageKey } from "@/app/sysAdmin/_shared/components/StageColors";
import { StageLegend } from "@/app/sysAdmin/_shared/components/StageLegend";
import { StageProgressBar } from "@/app/sysAdmin/_shared/components/StageProgressBar";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  stages: GqlSysAdminStageDistribution | null;
};

export function StageDistributionPanel({ stages }: Props) {
  const labels = sysAdminDashboardJa.detail.stages;

  if (!stages) {
    return (
      <ChartCard title={labels.title}>
        <div className="min-h-[200px]" />
      </ChartCard>
    );
  }

  const counts: Record<StageKey, number> = {
    habitual: stages.habitual.count,
    regular: stages.regular.count,
    occasional: stages.occasional.count,
    latent: stages.latent.count,
  };

  const buckets: Record<StageKey, GqlSysAdminStageDistribution["habitual"]> = {
    habitual: stages.habitual,
    regular: stages.regular,
    occasional: stages.occasional,
    latent: stages.latent,
  };

  return (
    <ChartCard
      title={
        <span className="inline-flex items-center gap-2">
          <span>{labels.title}</span>
          <MetricInfoButton metricKey="stages" />
          <StageLegend className="ml-1" />
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <StageProgressBar counts={counts} />

        <ul className="flex flex-col gap-1.5 text-sm">
          {STAGE_KEYS.map((stage) => {
            const bucket = buckets[stage];
            const isLatent = stage === "latent";
            return (
              <li
                key={stage}
                className="grid grid-cols-[auto_1fr_auto] items-baseline gap-2"
              >
                <span className="inline-flex items-center gap-1">
                  <StageDot stage={stage} />
                  <span className="font-medium">{labels[stage]}</span>
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {!isLatent && (
                    <>
                      {labels.avgSendRate} {toPct(bucket.avgSendRate)}
                      <span className="mx-1">·</span>
                    </>
                  )}
                  {labels.avgMonthsIn} {bucket.avgMonthsIn.toFixed(1)}ヶ月
                </span>
                <span className="tabular-nums">
                  <span className="font-medium">{toIntJa(bucket.count)}</span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {toPct(bucket.pct)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCard>
  );
}
