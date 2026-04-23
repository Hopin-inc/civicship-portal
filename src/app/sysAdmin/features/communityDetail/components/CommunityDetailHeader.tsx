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
  controls?: ReactNode;
};

type SubMetric = {
  label: string;
  value: string;
};

/**
 * Header layout:
 * - Row 1: alert (左) / controls (右)
 * - Row 2: 稼働率 text-5xl bold + PercentDelta (label なし inline 右)
 * - Row 3: sub-metrics grid (label 上 muted / 値 下 bold) で並列整列
 *
 * 旧構成で散らばっていた 3ヶ月平均・発足月は削除、累計pt と最大 chain だけを
 * 人数と並列で表示。サブ指標は全部同じフォーマットに揃えて読みやすさを確保。
 */
export function CommunityDetailHeader({ summary, alerts, controls }: Props) {
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
    <header className="flex flex-col gap-4">
      {/* Row 1: alert + controls */}
      {(alerts || controls) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-[1.5rem]">
            <PrimaryAlertBadge alerts={alerts} />
          </div>
          {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
        </div>
      )}

      {/* Row 2: 主指標 */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-5xl font-bold tabular-nums leading-tight">
          {toPct(summary.communityActivityRate)}
        </span>
        <PercentDelta value={summary.growthRateActivity} className="text-lg" />
      </div>

      {/* Row 3: sub-metrics grid */}
      {subMetrics.length > 0 && (
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          {subMetrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{m.label}</dt>
              <dd className="text-lg font-semibold tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
