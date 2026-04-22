"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { formatIsoWeek } from "@/app/sysAdmin/_shared/format/date";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { EmptyChart } from "@/app/sysAdmin/_shared/components/EmptyChart";

export type RetentionWeeklyDatum = {
  week: string;
  retainedSenders: number;
  churnedSenders: number;
  returnedSenders: number;
  communityActivityRate: number | null;
};

type Props = {
  data: RetentionWeeklyDatum[];
  height?: number;
};

export function RetentionWeeklyStackedChart({ data, height = 240 }: Props) {
  if (data.length === 0) {
    return <EmptyChart message={sysAdminDashboardJa.state.chartEmpty} />;
  }

  const chartData = data.map((d) => ({
    ...d,
    weekLabel: formatIsoWeek(d.week),
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="weekLabel" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis yAxisId="count" tick={{ fontSize: 10 }} width={32} />
          <YAxis
            yAxisId="rate"
            orientation="right"
            domain={[0, 1]}
            tickFormatter={(v) => toPct(v as number)}
            tick={{ fontSize: 10 }}
            width={36}
          />
          <Tooltip
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value ?? 0);
              if (name === sysAdminDashboardJa.detail.monthly.activityRate) return toPct(n);
              return n.toLocaleString("ja-JP");
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="count"
            dataKey="retainedSenders"
            stackId="s"
            name={sysAdminDashboardJa.detail.retention.retained}
            fill="#0ea5e9"
            isAnimationActive={false}
          />
          <Bar
            yAxisId="count"
            dataKey="returnedSenders"
            stackId="s"
            name={sysAdminDashboardJa.detail.retention.returned}
            fill="#22c55e"
            isAnimationActive={false}
          />
          <Bar
            yAxisId="count"
            dataKey="churnedSenders"
            stackId="s"
            name={sysAdminDashboardJa.detail.retention.churned}
            fill="#ef4444"
            isAnimationActive={false}
          />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="communityActivityRate"
            name={sysAdminDashboardJa.detail.monthly.activityRate}
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
