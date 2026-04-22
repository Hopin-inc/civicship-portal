import React from "react";
import type {
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunitySummaryCard,
} from "@/types/graphql";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { formatJstDate } from "@/app/sysAdmin/_shared/format/date";
import { toCompactJa, toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  summary: GqlSysAdminCommunitySummaryCard;
  alerts: GqlSysAdminCommunityAlerts;
};

export function CommunityDetailHeader({ summary, alerts }: Props) {
  const t = sysAdminDashboardJa.detail.header;

  // 各項目を独立した inline-block に分割して、mobile 幅では自然に改行
  // させつつ "中黒孤立" のような見苦しい wrap を回避する。
  const metaItems: string[] = [
    `${toIntJa(summary.totalMembers)}${t.memberSuffix}`,
  ];
  if (summary.dataFrom && summary.dataTo) {
    metaItems.push(`${formatJstDate(summary.dataFrom)} 〜 ${formatJstDate(summary.dataTo)}`);
  }
  metaItems.push(`累計 ${toCompactJa(summary.totalDonationPointsAllTime)}${t.donationSuffix}`);
  if (summary.maxChainDepthAllTime != null) {
    metaItems.push(`${t.chainPrefix} ${summary.maxChainDepthAllTime}${t.chainSuffix}`);
  }

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{summary.communityName}</h1>
        <PrimaryAlertBadge alerts={alerts} />
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {metaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-4xl font-semibold tabular-nums">
            {toPct(summary.communityActivityRate)}
          </span>
          <MetricInfoButton metricKey="communityActivityRate" />
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>
            {t.growth}{" "}
            <PercentDelta value={summary.growthRateActivity} className="font-normal" />
          </span>
          <span>
            {t.threeMonthAvg} {toPct(summary.communityActivityRate3mAvg)}
          </span>
        </div>
      </div>
    </header>
  );
}
