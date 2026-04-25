"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight, Clock } from "lucide-react";
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
  /** L2 schema には未掲載のため preview として外部から渡す。 */
  hubMemberCount?: number;
  communityName?: string;
  newMemberCount?: number;
};

/**
 * 4 階層スコープ (コミュニティ ⊃ ネットワーク ⊃ アクティビティ ⊃ ユーザー)
 * を「物語化」した overview。コミュニティはヘッダー直下の stat band に
 * 圧縮、それ以外の 3 scope はヒーロー数値 + 警告 block + 準備中 footer
 * で構成。subpage への CTA は section 見出しの右端。
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
  const habitualCount = stages.habitual.count;
  const regularCount = stages.regular.count;
  const occasionalCount = stages.occasional.count;
  const latentCount = stages.latent.count;

  const isolatedCount = data.memberList.users.filter(
    (u) => u.userSendRate >= 0.7 && u.uniqueDonationRecipients <= 1,
  ).length;

  const hubPct = totalMembers > 0 ? hubMemberCount / totalMembers : 0;
  const isolatedRatio = habitualCount > 0 ? isolatedCount / habitualCount : 0;
  const isolatedAlert = habitualCount > 0 && isolatedRatio >= 0.3;

  // network 量: 平均送付先数 (active な人だけで取る — 潜在を分母に含めると
  // 数字が薄まる)
  const activeMembers = data.memberList.users.filter((u) => u.userSendRate > 0);
  const avgRecipients =
    activeMembers.length > 0
      ? activeMembers.reduce((acc, u) => acc + u.uniqueDonationRecipients, 0) /
        activeMembers.length
      : 0;

  // network 質: 連鎖率 (今月 = monthlyActivityTrend の最新点)
  const latestMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 1];
  const latestChainPct = latestMonth?.chainPct ?? null;

  const cohortLatest = data.cohortRetention[data.cohortRetention.length - 1];
  const cohortPrev = data.cohortRetention[data.cohortRetention.length - 2];
  const cohortDelta =
    cohortLatest?.retentionM1 != null && cohortPrev?.retentionM1 != null
      ? cohortLatest.retentionM1 - cohortPrev.retentionM1
      : null;
  const cohortAlert = cohortDelta != null && cohortDelta <= -0.05;

  const habitualOverRegular = habitualCount > 0 && regularCount > habitualCount;

  const ageMonths =
    summary.dataFrom && summary.dataTo
      ? Math.round(
          (summary.dataTo.getTime() - summary.dataFrom.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        )
      : null;

  return (
    <div className="flex flex-col gap-10">
      {/* community-name + 規模 */}
      {communityName && (
        <header className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-semibold leading-tight">
              {communityName}
            </h1>
            <div className="flex items-baseline gap-1 tabular-nums text-muted-foreground">
              <span className="text-base font-medium">
                {toIntJa(totalMembers)}
              </span>
              <span className="text-xs">名</span>
              {newMemberCount != null && (
                <span className="text-xs">(+{toIntJa(newMemberCount)} 今月)</span>
              )}
            </div>
          </div>

          {/* COMMUNITY band — scope の section にせず stat 横並び */}
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm tabular-nums">
            {ageMonths != null && (
              <div className="flex items-baseline gap-1.5">
                <dt className="text-xs text-muted-foreground">活動期間</dt>
                <dd>{ageMonths} ヶ月</dd>
              </div>
            )}
            <div className="flex items-baseline gap-1.5">
              <dt className="text-xs text-muted-foreground">累計流通</dt>
              <dd>
                {toCompactJa(summary.totalDonationPointsAllTime)}
                <span className="text-xs text-muted-foreground"> pt</span>
              </dd>
            </div>
            {summary.maxChainDepthAllTime != null && (
              <div className="flex items-baseline gap-1.5">
                <dt className="text-xs text-muted-foreground">最大連鎖</dt>
                <dd>{summary.maxChainDepthAllTime} 段</dd>
              </div>
            )}
          </dl>
        </header>
      )}

      <Scope title="ネットワーク" detailHref={`/sysAdmin/${data.communityId}/network`}>
        <DualAxis
          quantity={[
            { value: toIntJa(hubMemberCount), unit: "名", label: "ハブユーザー" },
            {
              value: avgRecipients > 0 ? avgRecipients.toFixed(1) : "-",
              unit: "人",
              label: "平均送付先",
            },
          ]}
          quality={[
            { value: toPct(hubPct), label: "ハブユーザー比率" },
            {
              value: latestChainPct != null ? toPct(latestChainPct) : "-",
              label: "連鎖率 (今月)",
            },
          ]}
        />

        {isolatedAlert && (
          <Issue title="送付先の孤立">
            習慣化層 {habitualCount} 名のうち {isolatedCount} 名 ({toPct(isolatedRatio)}) が単一相手のみ。送付先の多様化が改善ポイント。
          </Issue>
        )}

        <Pending
          items={[
            "ハブ集中度 (Pareto)",
            "連鎖起点率",
            "関係幅分布",
            "送付件数 (今月)",
          ]}
        />
      </Scope>

      <Scope title="アクティビティ" detailHref={`/sysAdmin/${data.communityId}/activity`}>
        <Hero
          label="今月の MAU%"
          value={
            <span className="inline-flex items-baseline gap-2">
              <span>{toPct(summary.communityActivityRate)}</span>
              {summary.growthRateActivity != null && (
                <PercentDelta
                  value={summary.growthRateActivity}
                  className="text-base"
                />
              )}
            </span>
          }
        />

        {data.cohortRetention.length > 0 && (
          <ChartBlock title="コホート retention">
            <CohortRetentionAreaChart
              data={buildCohortChartData(data.cohortRetention)}
              height={220}
            />
            {cohortAlert && cohortLatest?.retentionM1 != null && (
              <Issue title="直近コホートの M+1 低下">
                最新月 {toPct(cohortLatest.retentionM1)}
                {cohortPrev?.retentionM1 != null &&
                  ` (前期 ${toPct(cohortPrev.retentionM1)})`}
                。Onboarding が機能していない可能性。
              </Issue>
            )}
          </ChartBlock>
        )}

        {data.retentionTrend.length > 0 && (
          <ChartBlock title="週次 retention">
            <RetentionWeeklyStackedChart
              data={data.retentionTrend.map<RetentionWeeklyDatum>((p) => ({
                week: formatJstDate(p.week),
                retainedSenders: p.retainedSenders,
                churnedSenders: p.churnedSenders,
                returnedSenders: p.returnedSenders,
                communityActivityRate: p.communityActivityRate ?? null,
              }))}
              height={220}
            />
          </ChartBlock>
        )}
      </Scope>

      <Scope title="ユーザー" detailHref={`/sysAdmin/${data.communityId}/users`}>
        <div className="flex flex-col gap-3">
          <span className="text-xs text-muted-foreground">ステージ分布</span>
          <StageProgressBar
            counts={{
              habitual: habitualCount,
              regular: regularCount,
              occasional: occasionalCount,
              latent: latentCount,
            }}
            showLabels={false}
          />
          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm tabular-nums">
            <StageStat label="習慣化" count={habitualCount} pct={stages.habitual.pct} />
            <StageStat
              label="定期"
              count={regularCount}
              pct={stages.regular.pct}
              accent={habitualOverRegular}
            />
            <StageStat label="散発" count={occasionalCount} pct={stages.occasional.pct} />
            <StageStat label="潜在" count={latentCount} pct={stages.latent.pct} />
          </dl>
        </div>

        {habitualOverRegular && (
          <Issue title="「定期」が「習慣化」を超過">
            定期 {regularCount} 名 が 習慣化 {habitualCount} 名 を上回っている。中堅層の習慣化に伸びしろ。
          </Issue>
        )}

        <Pending items={["落下リスク", "昇格率"]} />
      </Scope>
    </div>
  );
}

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------

function Scope({
  title,
  detailHref,
  children,
}: {
  title: string;
  detailHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t pt-6">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
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
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Hero({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-4xl font-semibold tabular-nums leading-none tracking-tight">
        {value}
      </span>
    </div>
  );
}

type AxisItem = { value: React.ReactNode; unit?: string; label: string };

function DualAxis({
  quantity,
  quality,
}: {
  quantity: AxisItem[];
  quality: AxisItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      <AxisColumn title="量" items={quantity} />
      <AxisColumn title="質" items={quality} />
    </div>
  );
}

function AxisColumn({ title, items }: { title: string; items: AxisItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1">
          <span className="inline-flex items-baseline gap-1 text-3xl font-semibold tabular-nums leading-none tracking-tight">
            {item.value}
            {item.unit && (
              <span className="text-base font-medium text-muted-foreground">
                {item.unit}
              </span>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Issue({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50/60 p-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-amber-900">{title}</p>
        <p className="text-sm leading-relaxed text-amber-900/80">{children}</p>
      </div>
    </div>
  );
}

function ChartBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{title}</span>
      {children}
    </div>
  );
}

function Pending({ items }: { items: string[] }) {
  return (
    <div className="flex items-baseline gap-2 pt-1 text-xs text-muted-foreground">
      <Clock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
      <span>準備中: {items.join(" · ")}</span>
    </div>
  );
}

function StageStat({
  label,
  count,
  pct,
  accent,
}: {
  label: string;
  count: number;
  pct: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1">
      <dt className={cn("text-xs", accent ? "text-amber-700" : "text-muted-foreground")}>
        {label}
      </dt>
      <dd className={cn(accent && "font-medium text-amber-900")}>
        {toIntJa(count)}
        <span className="text-xs text-muted-foreground"> ({toPct(pct)})</span>
      </dd>
    </div>
  );
}
