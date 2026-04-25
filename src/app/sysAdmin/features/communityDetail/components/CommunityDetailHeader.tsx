import React, { ReactNode } from "react";
import type {
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunitySummaryCard,
} from "@/types/graphql";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";
import { toCompactJa, toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  summary: GqlSysAdminCommunitySummaryCard;
  alerts: GqlSysAdminCommunityAlerts;
  /** アラート行の右に配置する補助コントロール (用語 Button など) */
  controls?: ReactNode;
  /** MAU% 行の右端に配置する期間セレクト */
  periodControl?: ReactNode;
};

type SubMetric = {
  label: string;
  value: string;
};

/**
 * Header layout (size を抑えた落ち着き優先):
 * - Row 1: alert (左) / controls (右)
 * - Row 2: [text-3xl semibold MAU%] [sm delta]  ·  [periodControl] (右寄せ)
 * - Row 3: sub-metrics (label xs / 値 base) を label上/値下 pair で整列
 */
export function CommunityDetailHeader({
  summary,
  alerts,
  controls,
  periodControl,
}: Props) {
  const t = sysAdminDashboardJa.detail.header;

  const subMetrics: SubMetric[] = [
    { label: "メンバー", value: `${toIntJa(summary.totalMembers)}${t.memberSuffix}` },
    {
      label: "累計",
      value: `${toCompactJa(summary.totalDonationPointsAllTime)}${t.donationSuffix}`,
    },
  ];
  if (summary.maxChainDepthAllTime != null) {
    subMetrics.push({
      label: t.chainPrefix,
      value: `${summary.maxChainDepthAllTime}${t.chainSuffix}`,
    });
  }

  return (
    <header className="flex flex-col gap-3">
      {/* Row 1: alert + optional controls (用語 etc.) */}
      {(alerts || controls) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-[1.5rem]">
            <PrimaryAlertBadge alerts={alerts} />
          </div>
          {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
        </div>
      )}

      {/* Row 2: MAU% + 前月比 + periodControl (右) */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-semibold tabular-nums leading-tight">
            {toPct(summary.communityActivityRate)}
          </span>
          {summary.growthRateActivity != null && (
            <span className="text-sm" aria-label="MAU% 前月比">
              (
              <PercentDelta
                value={summary.growthRateActivity}
                className="text-sm"
              />
              )
            </span>
          )}
        </div>
        {periodControl && (
          <div className="flex items-center self-center">{periodControl}</div>
        )}
      </div>

      {/* Row 3: sub-metrics grid */}
      {subMetrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {subMetrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{m.label}</dt>
              <dd className="text-base font-semibold tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
