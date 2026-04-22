"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

export type StageDatum = {
  stage: "habitual" | "regular" | "occasional" | "latent";
  label: string;
  count: number;
  pct: number;
};

type Props = {
  data: StageDatum[];
  height?: number;
};

const STAGE_COLOR: Record<StageDatum["stage"], string> = {
  habitual: "#0ea5e9",
  regular: "#6366f1",
  occasional: "#a78bfa",
  latent: "#cbd5e1",
};

export function StageDistributionDonut({ data, height = 260 }: Props) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) {
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
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.stage} fill={STAGE_COLOR[d.stage]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, item) => {
              const datum = (item?.payload ?? {}) as StageDatum;
              const n = typeof value === "number" ? value : Number(value ?? 0);
              return [`${n.toLocaleString("ja-JP")} (${toPct(datum.pct)})`, datum.label];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
