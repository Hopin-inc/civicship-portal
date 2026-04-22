import React, { useMemo } from "react";
import type { GqlSysAdminCohortRetentionPoint } from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { CohortRetentionAreaChart } from "@/app/sysAdmin/_shared/charts/CohortRetentionAreaChart";
import { buildCohortChartData } from "@/app/sysAdmin/_shared/charts/buildCohortChartData";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  points: GqlSysAdminCohortRetentionPoint[];
  /** Number of most-recent cohorts to display. 0 = show all available. */
  cohortMonths: number;
};

export function CohortRetentionPanel({ points, cohortMonths }: Props) {
  const chartData = useMemo(
    () => buildCohortChartData(points, cohortMonths),
    [points, cohortMonths],
  );

  return (
    <ChartCard
      title={
        <span className="inline-flex items-center gap-2">
          <span>{sysAdminDashboardJa.detail.cohort.title}</span>
          <MetricInfoButton metricKey="cohortRetention" />
        </span>
      }
    >
      <CohortRetentionAreaChart data={chartData} />
    </ChartCard>
  );
}
