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
 * 3 行構成に再編:
 * - Row 1: 名前 + アラート (左) / コントロール (右)
 * - Row 2: 主指標 (3xl) + 前月比 + 3ヶ月平均 inline + ⓘ
 * - Row 3: secondary meta (muted small) — 人数 / 発足 / 累計 / chain を 1 行に圧縮
 *
 * 旧実装は 4 行 + 外側の control row で 5 ブロックに分かれており、
 * ステージ分布に到達するまで視線が迷う問題があった。
 */
export function CommunityDetailHeader({ summary, alerts, controls }: Props) {
  const t = sysAdminDashboardJa.detail.header;

  const metaItems: string[] = [
    `${toIntJa(summary.totalMembers)}${t.memberSuffix}`,
  ];
  if (summary.dataFrom) {
    metaItems.push(`発足 ${formatJstMonth(summary.dataFrom)}`);
  }
  metaItems.push(`累計 ${toCompactJa(summary.totalDonationPointsAllTime)}${t.donationSuffix}`);
  if (summary.maxChainDepthAllTime != null) {
    metaItems.push(`${t.chainPrefix} ${summary.maxChainDepthAllTime}${t.chainSuffix}`);
  }

  return (
    <header className="flex flex-col gap-3">
      {/* Row 1: identity + controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold">{summary.communityName}</h1>
          <PrimaryAlertBadge alerts={alerts} />
        </div>
        {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
      </div>

      {/* Row 2: primary metric inline */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-semibold tabular-nums">
          {toPct(summary.communityActivityRate)}
        </span>
        <MetricInfoButton metricKey="communityActivityRate" />
        <PercentDelta value={summary.growthRateActivity} />
        <span className="text-sm text-muted-foreground">
          {t.threeMonthAvg} {toPct(summary.communityActivityRate3mAvg)}
        </span>
      </div>

      {/* Row 3: secondary meta */}
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {metaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </header>
  );
}
