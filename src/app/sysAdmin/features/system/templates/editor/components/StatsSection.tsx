"use client";

import { AlertTriangle } from "lucide-react";
import type { TemplateBreakdownRow } from "@/app/sysAdmin/features/system/templates/shared/fixtures";

type Props = {
  rows: TemplateBreakdownRow[];
};

/**
 * 渡された breakdown rows を集約して、評価指標を summary 形式で表示。
 * VersionSelector で絞った rows を渡すことで「特定 version の評価」が見れる。
 */
export function StatsSection({ rows }: Props) {
  const totalFeedback = rows.reduce((s, r) => s + r.feedbackCount, 0);

  const weightedSum = rows.reduce(
    (s, r) => (r.avgRating != null ? s + r.avgRating * r.feedbackCount : s),
    0,
  );
  const avgRating = totalFeedback > 0 ? weightedSum / totalFeedback : null;

  const judgeWeightedSum = rows.reduce(
    (s, r) =>
      r.avgJudgeScore != null ? s + r.avgJudgeScore * r.feedbackCount : s,
    0,
  );
  const avgJudgeScore = totalFeedback > 0 ? judgeWeightedSum / totalFeedback : null;

  const correlationsAvailable = rows.filter(
    (r) => r.judgeHumanCorrelation != null,
  );
  const avgCorrelation =
    correlationsAvailable.length > 0
      ? correlationsAvailable.reduce(
          (s, r) => s + (r.judgeHumanCorrelation as number),
          0,
        ) / correlationsAvailable.length
      : null;

  const hasWarning = rows.some((r) => r.correlationWarning);

  return (
    <section className="space-y-2">
      <h3 className="text-body-sm font-semibold">評価</h3>
      <div className="grid grid-cols-4 gap-2">
        <StatCell label="avgRating" value={avgRating?.toFixed(2)} />
        <StatCell label="feedback" value={String(totalFeedback)} />
        <StatCell label="judge相関" value={avgCorrelation?.toFixed(2)} />
        <StatCell
          label="warning"
          value={hasWarning ? "あり" : "なし"}
          variant={hasWarning ? "warning" : "default"}
        />
      </div>
    </section>
  );
}

function StatCell({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string | undefined;
  variant?: "default" | "warning";
}) {
  return (
    <div className="rounded border border-border bg-muted/30 p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-body-xs text-muted-foreground">
        {variant === "warning" && <AlertTriangle className="h-3 w-3 text-destructive" />}
        {label}
      </div>
      <div
        className={
          "text-body-md font-semibold tabular-nums " +
          (variant === "warning" ? "text-destructive" : "")
        }
      >
        {value ?? "—"}
      </div>
    </div>
  );
}
