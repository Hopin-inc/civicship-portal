"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { pickCohortColor } from "./cohortColors";
import type { CohortChartData } from "./buildCohortChartData";

type Props = {
  data: CohortChartData;
  height?: number;
};

export function CohortRetentionAreaChart({ data, height = 240 }: Props) {
  if (data.cohortLabels.length === 0) {
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

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.rows} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="n" tick={{ fontSize: 11 }} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            width={36}
          />
          <Tooltip
            formatter={(value) => {
              if (value === null || value === undefined) return ["-", ""];
              const n = typeof value === "number" ? value : Number(value);
              return [`${n.toFixed(1)}%`, ""];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {data.cohortLabels.map((label, i) => {
            const color = pickCohortColor(i);
            return (
              <Area
                key={label}
                type="monotone"
                dataKey={label}
                name={label}
                stroke={color}
                fill={color}
                fillOpacity={0.15}
                strokeWidth={2}
                connectNulls={false}
                isAnimationActive={false}
                dot={{ r: 3 }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
