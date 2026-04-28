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
import type {
  GqlAdminReportSummaryRowFieldsFragment,
  GqlSysAdminCommunityOverview,
} from "@/types/graphql";

type Props = {
  row: GqlSysAdminCommunityOverview;
  /**
   * `GET_ADMIN_REPORT_SUMMARY` から取得した、この community の最新公開状況。
   * 取得失敗時は undefined。表示すべき情報が無いときは Pill が出ないだけで
   * 既存 row レイアウトに影響しない。
   */
  reportSummary?: GqlAdminReportSummaryRowFieldsFragment;
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
          {reportSummary && (
            <ReportPills summary={reportSummary} />
          )}
        </div>
        <TenureBar distribution={row.tenureDistribution} showLabels={false} />
      </ItemFooter>
    </Item>
  );
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

type ReportPillsProps = {
  summary: GqlAdminReportSummaryRowFieldsFragment;
};

/**
 * Report 公開状況の Pill 群。
 * - 「最終公開」: daysSinceLastPublish に応じて 今日 / Nd 前 / 未公開 を出す。
 *   31 日以上は destructive 寄りの色で停滞を強調。
 * - 「90d」: 直近 90 日の公開数。0 件のときも表示してエンゲージ低下を可視化。
 */
function ReportPills({ summary }: ReportPillsProps) {
  const days = summary.daysSinceLastPublish;
  let lastLabel: string;
  let stale = false;
  if (days == null) {
    lastLabel = "未公開";
  } else if (days <= 0) {
    lastLabel = "今日";
  } else {
    lastLabel = `${toIntJa(days)}d 前`;
    stale = days >= 31;
  }

  return (
    <>
      <span className="inline-flex items-baseline gap-1">
        <span className="rounded-md border border-border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Report
        </span>
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            stale && "text-destructive",
            days == null && "text-muted-foreground",
          )}
        >
          {lastLabel}
        </span>
      </span>
      <span className="inline-flex items-baseline gap-1 text-xs text-muted-foreground">
        <span>90d</span>
        <span className="tabular-nums">
          {toIntJa(summary.publishedCountLast90Days)}
        </span>
      </span>
    </>
  );
}
