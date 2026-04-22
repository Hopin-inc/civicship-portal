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

        <ul className="flex flex-col gap-2 text-sm md:gap-1.5">
          {STAGE_KEYS.map((stage) => {
            const bucket = buckets[stage];
            const isLatent = stage === "latent";
            return (
              <li
                key={stage}
                className="flex flex-col gap-0.5 md:grid md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-2"
              >
                <div className="flex items-baseline justify-between gap-2 md:contents">
                  <span className="inline-flex items-center gap-1">
                    <StageDot stage={stage} />
                    <span className="font-medium">{labels[stage]}</span>
                  </span>
                  <span className="tabular-nums md:order-last">
                    <span className="font-medium">{toIntJa(bucket.count)}</span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      {toPct(bucket.pct)}
                    </span>
                  </span>
                </div>
                <span className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs tabular-nums text-muted-foreground">
                  {!isLatent && (
                    <span>
                      {labels.avgSendRate} {toPct(bucket.avgSendRate)}
                    </span>
                  )}
                  <span>
                    {labels.avgMonthsIn} {bucket.avgMonthsIn.toFixed(1)}ヶ月
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
