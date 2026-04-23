import React, { ReactNode } from "react";
import type {
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunitySummaryCard,
} from "@/types/graphql";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { formatJstMonth } from "@/app/sysAdmin/_shared/format/date";
import { toCompactJa, toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  summary: GqlSysAdminCommunitySummaryCard;
  alerts: GqlSysAdminCommunityAlerts;
  /**
   * 右肩に寄せるコントロール群 (AsOf + SettingsDrawer 等)。
   * 見出しと同じ行に並ぶことでヘッダ内部に収め、別 row として
   * 浮遊しないようにする。
   */
  controls?: ReactNode;
};

/**
 * コミュニティ名は page header (useHeaderConfig) 側で扱うためここでは表示しない。
 * 3 行構成:
 * - Row 1: アラートバッジ (左) / コントロール (右)
 * - Row 2: 主指標 (3xl 稼働率) + ⓘ + 前月比 +N.N% + 3ヶ月平均 N.N%
 * - Row 3: primary meta (人数 + 発足月)
 * - Row 4: tertiary meta (累計/chain) — 更に muted で背景情報扱い
 */
export function CommunityDetailHeader({ summary, alerts, controls }: Props) {
  const t = sysAdminDashboardJa.detail.header;

  const primaryMeta = [
    `${toIntJa(summary.totalMembers)}${t.memberSuffix}`,
    summary.dataFrom ? `発足 ${formatJstMonth(summary.dataFrom)}` : null,
  ].filter(Boolean) as string[];

  const tertiaryMeta: string[] = [
    `累計 ${toCompactJa(summary.totalDonationPointsAllTime)}${t.donationSuffix}`,
  ];
  if (summary.maxChainDepthAllTime != null) {
    tertiaryMeta.push(
      `${t.chainPrefix} ${summary.maxChainDepthAllTime}${t.chainSuffix}`,
    );
  }

  return (
    <header className="flex flex-col gap-3">
      {/* Row 1: alert + controls (名前は page header に移したのでここでは出さない) */}
      {(alerts || controls) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-[1.5rem]">
            <PrimaryAlertBadge alerts={alerts} />
          </div>
          {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
        </div>
      )}

      {/* Row 2: primary metric inline with labels */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-semibold tabular-nums">
          {toPct(summary.communityActivityRate)}
        </span>
        <MetricInfoButton metricKey="communityActivityRate" />
        <span className="text-sm text-muted-foreground">
          {t.growth}{" "}
          <PercentDelta value={summary.growthRateActivity} className="font-normal" />
        </span>
        <span className="text-sm text-muted-foreground">
          {t.threeMonthAvg} {toPct(summary.communityActivityRate3mAvg)}
        </span>
      </div>

      {/* Row 3: primary meta (人数 + 発足) */}
      {primaryMeta.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {primaryMeta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {/* Row 4: tertiary meta (累計・chain — より muted) */}
      {tertiaryMeta.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/80">
          {tertiaryMeta.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </header>
  );
}
