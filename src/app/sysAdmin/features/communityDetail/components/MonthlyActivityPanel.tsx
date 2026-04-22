import { useMemo } from "react";
import type { GqlSysAdminMonthlyActivityPoint } from "@/types/graphql";
import { ChartCard } from "@/app/sysAdmin/_shared/components/ChartCard";
import {
  MonthlyActivityComposedChart,
  type MonthlyActivityDatum,
} from "@/app/sysAdmin/_shared/charts/MonthlyActivityComposedChart";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  points: GqlSysAdminMonthlyActivityPoint[];
};

export function MonthlyActivityPanel({ points }: Props) {
  const data = useMemo<MonthlyActivityDatum[]>(
    () =>
      points.map((p) => ({
        month: typeof p.month === "string" ? p.month : p.month.toISOString(),
        senderCount: p.senderCount,
        newMembers: p.newMembers,
        communityActivityRate: p.communityActivityRate,
      })),
    [points],
  );

  return (
    <ChartCard title={sysAdminDashboardJa.detail.monthly.title}>
      <MonthlyActivityComposedChart data={data} />
    </ChartCard>
  );
}
