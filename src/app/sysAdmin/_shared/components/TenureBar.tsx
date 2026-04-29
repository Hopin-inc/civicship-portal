import React from "react";
import { cn } from "@/lib/utils";
import type { GqlAnalyticsTenureDistribution } from "@/types/graphql";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";

const BUCKET_KEYS = ["lt1Month", "m1to3Months", "m3to12Months", "gte12Months"] as const;
type BucketKey = (typeof BUCKET_KEYS)[number];

const BUCKET_LABELS: Record<BucketKey, string> = {
  lt1Month: "1ヶ月未満",
  m1to3Months: "1〜3ヶ月",
  m3to12Months: "3〜12ヶ月",
  gte12Months: "12ヶ月以上",
};

// 短い期間ほど薄く、長いほど濃いグラデーション。新規〜定着の流れを視覚的に伝える。
const BUCKET_BG: Record<BucketKey, string> = {
  lt1Month: "bg-emerald-200",
  m1to3Months: "bg-emerald-400",
  m3to12Months: "bg-emerald-600",
  gte12Months: "bg-emerald-800",
};

type Props = {
  distribution: GqlAnalyticsTenureDistribution;
  /** ラベル (4 バケットの数値) を表示するか。L1 row のような狭い領域では false。 */
  showLabels?: boolean;
  className?: string;
};

export function TenureBar({ distribution, showLabels = true, className }: Props) {
  const total = BUCKET_KEYS.reduce((sum, k) => sum + distribution[k], 0);

  const ariaLabel = total === 0
    ? "在籍期間分布: データなし"
    : `在籍期間分布: ${BUCKET_KEYS.map(
        (k) => `${BUCKET_LABELS[k]} ${distribution[k]}名`,
      ).join(", ")}`;

  return (
    <div className={className}>
      <div
        className="flex h-2 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={ariaLabel}
      >
        {total === 0 ? (
          <div className="h-full w-full bg-slate-100" />
        ) : (
          BUCKET_KEYS.map((key) => {
            const value = distribution[key];
            if (value === 0) return null;
            return (
              <div
                key={key}
                className={cn("h-full", BUCKET_BG[key])}
                style={{ width: `${(value / total) * 100}%` }}
              />
            );
          })
        )}
      </div>
      {showLabels && (
        <div className="mt-1 flex justify-between gap-1 text-[10px] tabular-nums text-muted-foreground">
          {BUCKET_KEYS.map((key) => (
            <span key={key} className="flex flex-col items-center">
              <span>{BUCKET_LABELS[key]}</span>
              <span>
                {toIntJa(distribution[key])} (
                {toPct(total > 0 ? distribution[key] / total : 0)})
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** 3 ヶ月以上 在籍率 (m3to12Months + gte12Months) ÷ total. */
export function deriveTenuredRatio(
  distribution: GqlAnalyticsTenureDistribution,
): number | null {
  const total =
    distribution.lt1Month +
    distribution.m1to3Months +
    distribution.m3to12Months +
    distribution.gte12Months;
  if (total === 0) return null;
  return (distribution.m3to12Months + distribution.gte12Months) / total;
}
