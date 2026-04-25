import React, { useMemo } from "react";
import type { GqlSysAdminCohortRetentionPoint } from "@/types/graphql";
import { Panel } from "@/app/sysAdmin/_shared/components/Panel";
import { CohortRetentionAreaChart } from "@/app/sysAdmin/_shared/charts/CohortRetentionAreaChart";
import { buildCohortChartData } from "@/app/sysAdmin/_shared/charts/buildCohortChartData";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  points: GqlSysAdminCohortRetentionPoint[];
};

/**
 * API が返す全コホートを描画する。表示する期間は Header の PeriodPreset が
 * API 側 windowMonths を絞ることで制御されるため、このコンポーネントは
 * slicing を行わない。
 */
export function CohortRetentionPanel({ points }: Props) {
  const chartData = useMemo(() => buildCohortChartData(points, 0), [points]);

  return (
    <Panel title={sysAdminDashboardJa.detail.cohort.title}>
      <CohortRetentionAreaChart data={chartData} />
    </Panel>
  );
}
