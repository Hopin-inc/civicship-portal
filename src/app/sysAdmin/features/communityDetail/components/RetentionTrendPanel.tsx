import { useMemo } from "react";
import type { GqlSysAdminRetentionTrendPoint } from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import {
  RetentionWeeklyStackedChart,
  type RetentionWeeklyDatum,
} from "@/app/sysAdmin/_shared/charts/RetentionWeeklyStackedChart";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  points: GqlSysAdminRetentionTrendPoint[];
};

export function RetentionTrendPanel({ points }: Props) {
  const data = useMemo<RetentionWeeklyDatum[]>(
    () =>
      points.map((p) => ({
        week: typeof p.week === "string" ? p.week : p.week.toISOString(),
        retainedSenders: p.retainedSenders,
        churnedSenders: p.churnedSenders,
        returnedSenders: p.returnedSenders,
        communityActivityRate: p.communityActivityRate ?? null,
      })),
    [points],
  );

  return (
    <ChartCard title={sysAdminDashboardJa.detail.retention.title}>
      <RetentionWeeklyStackedChart data={data} />
    </ChartCard>
  );
}
