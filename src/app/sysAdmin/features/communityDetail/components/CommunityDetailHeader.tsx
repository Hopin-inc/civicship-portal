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

  const metaParts: string[] = [
    `${toIntJa(summary.totalMembers)}${t.memberSuffix}`,
  ];
  if (summary.dataFrom && summary.dataTo) {
    metaParts.push(`${formatJstDate(summary.dataFrom)} 〜 ${formatJstDate(summary.dataTo)}`);
  }
  metaParts.push(`累計 ${toCompactJa(summary.totalDonationPointsAllTime)}${t.donationSuffix}`);
  if (summary.maxChainDepthAllTime != null) {
    metaParts.push(`${t.chainPrefix} ${summary.maxChainDepthAllTime}${t.chainSuffix}`);
  }

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{summary.communityName}</h1>
        <PrimaryAlertBadge alerts={alerts} />
      </div>

      <p className="text-sm text-muted-foreground">{metaParts.join(" · ")}</p>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="text-4xl font-semibold tabular-nums">
            {toPct(summary.communityActivityRate)}
          </span>
          <MetricInfoButton metricKey="communityActivityRate" />
        </div>
        <p className="text-sm text-muted-foreground">
          <span>
            {t.growth}{" "}
            <PercentDelta value={summary.growthRateActivity} className="font-normal" />
          </span>
          <span className="mx-1">·</span>
          <span>
            {t.threeMonthAvg} {toPct(summary.communityActivityRate3mAvg)}
          </span>
        </p>
      </div>
    </header>
  );
}
