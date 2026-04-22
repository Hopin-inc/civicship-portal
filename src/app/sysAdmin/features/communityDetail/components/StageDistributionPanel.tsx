import type { GqlSysAdminStageDistribution } from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { StatCell } from "@/app/sysAdmin/_shared/components/StatCell";
import {
  StageDistributionDonut,
  type StageDatum,
} from "@/app/sysAdmin/_shared/charts/StageDistributionDonut";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  stages: GqlSysAdminStageDistribution | null;
};

export function StageDistributionPanel({ stages }: Props) {
  if (!stages) {
    return (
      <ChartCard title={sysAdminDashboardJa.detail.stages.title}>
        <div className="min-h-[260px]" />
      </ChartCard>
    );
  }

  const labels = sysAdminDashboardJa.detail.stages;
  const data: StageDatum[] = [
    { stage: "habitual", label: labels.habitual, count: stages.habitual.count, pct: stages.habitual.pct },
    { stage: "regular", label: labels.regular, count: stages.regular.count, pct: stages.regular.pct },
    { stage: "occasional", label: labels.occasional, count: stages.occasional.count, pct: stages.occasional.pct },
    { stage: "latent", label: labels.latent, count: stages.latent.count, pct: stages.latent.pct },
  ];

  return (
    <ChartCard title={sysAdminDashboardJa.detail.stages.title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr]">
        <StageDistributionDonut data={data} />
        <div className="grid grid-cols-2 gap-3 content-start">
          {data.map((d) => (
            <StatCell
              key={d.stage}
              label={`${d.label} (${toPct(d.pct)})`}
              value={toIntJa(d.count)}
            />
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
