"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GqlGetSysAdminCommunityDetailQuery } from "@/types/graphql";
import {
  toCompactJa,
  toIntJa,
  toPct,
} from "@/app/sysAdmin/_shared/format/number";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { StageProgressBar } from "@/app/sysAdmin/_shared/components/StageProgressBar";
import { CohortRetentionAreaChart } from "@/app/sysAdmin/_shared/charts/CohortRetentionAreaChart";
import { buildCohortChartData } from "@/app/sysAdmin/_shared/charts/buildCohortChartData";
import {
  RetentionWeeklyStackedChart,
  type RetentionWeeklyDatum,
} from "@/app/sysAdmin/_shared/charts/RetentionWeeklyStackedChart";
import { formatJstDate } from "@/app/sysAdmin/_shared/format/date";

type DetailPayload = NonNullable<
  GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"]
>;

type Props = {
  data: DetailPayload;
  /**
   * Network-axis hub count. Not yet on the L2 schema; passed in as a
   * preview prop so the storybook can demo the design before the
   * backend exposes `hubMemberCount` on the detail payload.
   */
  hubMemberCount?: number;
  /** community-name + member-count band shown above the diagnostic. */
  communityName?: string;
  newMemberCount?: number;
};

type Severity = "ok" | "warn" | "todo";

/**
 * Single-page community overview, organized as four nested scopes:
 *
 *   COMMUNITY ⊃ NETWORK ⊃ ACTIVITY ⊃ USER
 *
 * COMMUNITY content lives entirely on this page (no subpage). The other
 * three scopes have a "詳細を見る →" CTA into a dedicated subpage where
 * the full graph viz / time-series filters / member list with bulk
 * actions live (Phase 2). The overview itself stays comprehensive but
 * compact — every implemented metric, every planned ★未実装 placeholder,
 * mini charts inline where the metric warrants it.
 */
export function CommunityDashboardOverview({
  data,
  hubMemberCount = 0,
  communityName,
  newMemberCount,
}: Props) {
  const summary = data.summary;
  const totalMembers = summary.totalMembers;
  const stages = data.stages;
  const tier1Count = stages.habitual.count;
  const tier2Count = stages.regular.count;
  const occasionalCount = stages.occasional.count;
  const latentCount = stages.latent.count;

  // Network: ノード軸 tier1 ∩ ネットワーク軸 breadth ≤ 1
  // (bare approximation from member list; the production version uses
  // a server aggregate so it doesn't depend on the fetched window of
  // members.)
  const isolatedCount = data.memberList.users.filter(
    (u) => u.userSendRate >= 0.7 && u.uniqueDonationRecipients <= 1,
  ).length;

  const hubPct = totalMembers > 0 ? hubMemberCount / totalMembers : 0;

  const cohortLatest = data.cohortRetention[data.cohortRetention.length - 1];
  const cohortPrev = data.cohortRetention[data.cohortRetention.length - 2];
  const cohortDelta =
    cohortLatest?.retentionM1 != null && cohortPrev?.retentionM1 != null
      ? cohortLatest.retentionM1 - cohortPrev.retentionM1
      : null;
  const cohortSeverity: Severity =
    cohortDelta != null && cohortDelta <= -0.05 ? "warn" : "ok";

  const isolatedSeverity: Severity =
    tier1Count > 0 && isolatedCount / tier1Count >= 0.3 ? "warn" : "ok";

  const habitualOverRegular = tier1Count > 0 && tier2Count > tier1Count;
  const regularSeverity: Severity = habitualOverRegular ? "warn" : "ok";

  const ageMonths =
    summary.dataFrom && summary.dataTo
      ? Math.round(
          (summary.dataTo.getTime() - summary.dataFrom.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        )
      : null;

  return (
    <div className="flex flex-col gap-2">
      {/* community-name band */}
      {communityName && (
        <header className="flex items-baseline gap-3 pb-1">
          <span className="text-xl font-semibold leading-tight">
            {communityName}
          </span>
          <div className="flex items-baseline gap-1 tabular-nums text-muted-foreground">
            <span className="text-base font-medium">
              {toIntJa(totalMembers)}
            </span>
            {newMemberCount != null && (
              <span className="text-xs">(+{toIntJa(newMemberCount)})</span>
            )}
          </div>
        </header>
      )}

      {/* COMMUNITY ─ subpage 無し、ここで完結 */}
      <Scope scope="COMMUNITY" subtitle="全体">
        <Metric severity="ok" label="total members" value={toIntJa(totalMembers)} />
        <Metric
          severity="ok"
          label="累計 throughput"
          value={`${toCompactJa(summary.totalDonationPointsAllTime)} pt`}
        />
        {summary.maxChainDepthAllTime != null && (
          <Metric
            severity="ok"
            label="最大 chain depth"
            value={`${summary.maxChainDepthAllTime} 段`}
          />
        )}
        {ageMonths != null && (
          <Metric severity="ok" label="data range" value={`${ageMonths} ヶ月`} />
        )}
      </Scope>

      <Scope
        scope="NETWORK"
        subtitle="関係構造"
        detailHref={`/sysAdmin/${data.communityId}/network`}
      >
        <Metric
          severity="ok"
          label="Hub user 比率"
          value={`${toPct(hubPct)} (今月)`}
        />
        <Metric
          severity={isolatedSeverity}
          label="送付先孤立"
          value={`tier1 ${tier1Count} 人中 ${isolatedCount} 人が単一相手`}
        />
        <Metric severity="todo" label="Hub 集中度 (Pareto)" todo />
        <Metric severity="todo" label="chain initiation 率" todo />
        <Metric severity="todo" label="breadth 分布" todo />
      </Scope>

      <Scope
        scope="ACTIVITY"
        subtitle="時系列"
        detailHref={`/sysAdmin/${data.communityId}/activity`}
      >
        <Metric
          severity="ok"
          label="MAU% (今月)"
          value={
            <span className="inline-flex items-baseline gap-1.5">
              <span>{toPct(summary.communityActivityRate)}</span>
              {summary.growthRateActivity != null && (
                <span className="text-xs text-muted-foreground">
                  (
                  <PercentDelta
                    value={summary.growthRateActivity}
                    className="text-xs"
                  />
                  )
                </span>
              )}
            </span>
          }
        />
        <Metric
          severity={cohortSeverity}
          label="最新 cohort M+1"
          value={
            cohortLatest?.retentionM1 != null
              ? `${toPct(cohortLatest.retentionM1)}${
                  cohortPrev?.retentionM1 != null
                    ? ` (前 ${toPct(cohortPrev.retentionM1)})`
                    : ""
                }`
              : "-"
          }
        >
          {data.cohortRetention.length > 0 && (
            <MiniChart>
              <CohortRetentionAreaChart
                data={buildCohortChartData(data.cohortRetention)}
                height={140}
              />
            </MiniChart>
          )}
        </Metric>
        <Metric severity="ok" label="weekly retention" value="安定">
          {data.retentionTrend.length > 0 && (
            <MiniChart>
              <RetentionWeeklyStackedChart
                data={data.retentionTrend.map<RetentionWeeklyDatum>((p) => ({
                  week: formatJstDate(p.week),
                  retainedSenders: p.retainedSenders,
                  churnedSenders: p.churnedSenders,
                  returnedSenders: p.returnedSenders,
                  communityActivityRate: p.communityActivityRate ?? null,
                }))}
                height={140}
              />
            </MiniChart>
          )}
        </Metric>
      </Scope>

      <Scope
        scope="USER"
        subtitle="個別"
        detailHref={`/sysAdmin/${data.communityId}/users`}
      >
        <Metric
          severity="ok"
          label="habitual"
          value={`${toIntJa(tier1Count)} (${toPct(stages.habitual.pct)})`}
        />
        <Metric
          severity={regularSeverity}
          label="regular"
          value={
            <span className="inline-flex items-baseline gap-1.5">
              <span>
                {toIntJa(tier2Count)} ({toPct(stages.regular.pct)})
              </span>
              {habitualOverRegular && (
                <span className="text-xs text-amber-600">← 超過</span>
              )}
            </span>
          }
        />
        <Metric
          severity="ok"
          label="occasional"
          value={`${toIntJa(occasionalCount)} (${toPct(stages.occasional.pct)})`}
        />
        <Metric
          severity="ok"
          label="latent"
          value={`${toIntJa(latentCount)} (${toPct(stages.latent.pct)})`}
        />
        <div className="px-1.5 pt-1">
          <StageProgressBar
            counts={{
              habitual: tier1Count,
              regular: tier2Count,
              occasional: occasionalCount,
              latent: latentCount,
            }}
            showLabels={false}
          />
        </div>
        <Metric severity="todo" label="落下リスク" todo />
        <Metric severity="todo" label="昇格率" todo />
      </Scope>
    </div>
  );
}

// ---------------------------------------------------------------
// Helpers (colocated; only used by this preview component)
// ---------------------------------------------------------------

function Scope({
  scope,
  subtitle,
  detailHref,
  children,
}: {
  scope: string;
  subtitle: string;
  detailHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col border-t pt-5">
      <header className="flex items-baseline justify-between gap-3 pb-1">
        <h2 className="flex items-baseline gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {scope}
          </span>
          <span className="text-sm font-medium text-foreground/80">
            {subtitle}
          </span>
        </h2>
        {detailHref && (
          <Link
            href={detailHref}
            className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:underline"
          >
            詳細を見る
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </header>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

function SeverityDot({ severity }: { severity: Severity }) {
  const cls = {
    ok: "text-emerald-500",
    warn: "text-amber-500",
    todo: "text-muted-foreground/40",
  }[severity];
  const ch = severity === "ok" ? "●" : severity === "warn" ? "⚠" : "○";
  return (
    <span className={cn("text-xs leading-none", cls)} aria-label={severity}>
      {ch}
    </span>
  );
}

function Metric({
  severity,
  label,
  value,
  todo,
  children,
}: {
  severity: Severity;
  label: string;
  value?: React.ReactNode;
  todo?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <SeverityDot severity={severity} />
          <span
            className={cn(
              "text-sm",
              todo && "text-muted-foreground/70",
            )}
          >
            {label}
          </span>
        </div>
        <div
          className={cn(
            "shrink-0 text-sm tabular-nums",
            todo && "text-muted-foreground/60",
          )}
        >
          {todo ? (
            <span className="text-[10px] uppercase tracking-wide">★ 未実装</span>
          ) : (
            value
          )}
        </div>
      </div>
      {children && <div className="pl-5 pt-1">{children}</div>}
    </div>
  );
}

function MiniChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="-ml-3 h-[140px] w-full max-w-md">
      {children}
    </div>
  );
}
