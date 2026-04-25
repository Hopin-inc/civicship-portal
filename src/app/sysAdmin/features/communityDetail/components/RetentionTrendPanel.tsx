import { useMemo } from "react";
import type { GqlSysAdminRetentionTrendPoint } from "@/types/graphql";
import { Panel } from "@/app/sysAdmin/_shared/components/Panel";
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
    <Panel title={sysAdminDashboardJa.detail.retention.title}>
      <RetentionWeeklyStackedChart data={data} />
    </Panel>
  );
}
