"use client";

import React from "react";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { TenureBar } from "@/app/sysAdmin/_shared/components/TenureBar";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { cn } from "@/lib/utils";
import {
  deriveActivityRate,
  deriveChurnedSenders,
  deriveGrowthRateActivity,
  deriveNewlyActivatedSenders,
} from "@/app/sysAdmin/_shared/derive";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";

/**
 * Phase 2 で backend 提供予定の adminReportSummary の community 単位サマリ。
 * 未 landing のため optional。値があれば「最終Report 発行 N日前」を pill 表示する。
 */
export type CommunityReportSummary = {
  daysSinceLastPublish: number | null;
  publishedCountLast90Days: number;
};

type Props = {
  row: GqlSysAdminCommunityOverview;
  reportSummary?: CommunityReportSummary | null;
  onClick?: (communityId: string) => void;
};

export function CommunityRow({ row, reportSummary, onClick }: Props) {
  const handleClick = () => onClick?.(row.communityId);
  const activityRate = deriveActivityRate(row);
  const growthRateActivity = deriveGrowthRateActivity(row);
  const newMemberCount = row.windowActivity.newMemberCount;
  const newlyActivated = deriveNewlyActivatedSenders(row);
  const churned = deriveChurnedSenders(row);

  return (
    <Item
      className={cn(
        "flex flex-col items-start gap-1",
        onClick && "cursor-pointer transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <ItemContent>
        <div className="flex w-full items-baseline justify-between gap-2">
          <ItemTitle className="min-w-0 flex-1 truncate text-base font-semibold">
            {row.communityName}
          </ItemTitle>
          <div className="flex shrink-0 items-baseline gap-1 tabular-nums text-muted-foreground">
            <span className="text-base font-medium">{toIntJa(row.totalMembers)}</span>
            <span className="text-xs">(+{toIntJa(newMemberCount)})</span>
          </div>
        </div>
      </ItemContent>

      <ItemFooter className="mt-0 w-full flex-col items-stretch gap-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <KpiPill label="MAU" value={toPct(activityRate)} delta={growthRateActivity} />
          <KpiPill label="Δ" value={`新規${toIntJa(newlyActivated)} / 休眠${toIntJa(churned)}`} />
          {reportSummary !== undefined && reportSummary !== null && (
            <KpiPill label="Report" value={formatReportRecency(reportSummary)} />
          )}
        </div>
        <TenureBar distribution={row.tenureDistribution} showLabels={false} />
      </ItemFooter>
    </Item>
  );
}

function formatReportRecency(summary: CommunityReportSummary): string {
  const days = summary.daysSinceLastPublish;
  if (days === null) return "未公開";
  if (days === 0) return "本日";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
}

type KpiPillProps = {
  label: string;
  value: string;
  delta?: number | null;
};

function KpiPill({ label, value, delta }: KpiPillProps) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="rounded-md border border-border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
      {delta !== undefined && delta !== null && (
        <span className="text-xs text-muted-foreground">
          (<PercentDelta value={delta} className="text-xs" />)
        </span>
      )}
    </span>
  );
}
