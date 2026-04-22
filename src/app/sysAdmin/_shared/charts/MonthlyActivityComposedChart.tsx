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
import { formatJstMonthShort } from "@/app/sysAdmin/_shared/format/date";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

export type MonthlyActivityDatum = {
  month: string;
  senderCount: number;
  newMembers: number;
  communityActivityRate: number;
};

type Props = {
  data: MonthlyActivityDatum[];
  height?: number;
};

export function MonthlyActivityComposedChart({ data, height = 240 }: Props) {
  if (data.length === 0) {
    return (
      <div
        role="status"
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        {sysAdminDashboardJa.state.chartEmpty}
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    monthLabel: formatJstMonthShort(d.month),
  }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
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
            dataKey="senderCount"
            name={sysAdminDashboardJa.detail.monthly.senderCount}
            fill="#0ea5e9"
            isAnimationActive={false}
          />
          <Bar
            yAxisId="count"
            dataKey="newMembers"
            name={sysAdminDashboardJa.detail.monthly.newMembers}
            fill="#a78bfa"
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
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
