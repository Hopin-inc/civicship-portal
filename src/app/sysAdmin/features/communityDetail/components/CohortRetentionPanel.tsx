import React, { useMemo } from "react";
import type { GqlSysAdminCohortRetentionPoint } from "@/types/graphql";
import { Panel } from "@/app/sysAdmin/_shared/components/Panel";
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
    <Panel title={sysAdminDashboardJa.detail.cohort.title}>
      <CohortRetentionAreaChart data={chartData} />
    </Panel>
  );
}
