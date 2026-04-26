"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CalendarCheck,
  ChevronRight,
  Hourglass,
  Link2,
  type LucideIcon,
  Moon,
  Network,
  PieChart,
  Repeat,
  Send,
  Star,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GqlGetSysAdminCommunityDetailQuery } from "@/types/graphql";
import {
  toCompactJa,
  toIntJa,
  toPct,
} from "@/app/sysAdmin/_shared/format/number";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { TENURE_THRESHOLD_DAYS } from "@/app/sysAdmin/_shared/derive";

type DetailPayload = NonNullable<
  GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"]
>;

type Props = {
  data: DetailPayload;
  /** L2 schema には未掲載のため preview として外部から渡す。production
   * では undefined を渡すと「未計測」表示にフォールバック。 */
  hubMemberCount?: number;
  communityName?: string;
  newMemberCount?: number;
  /** subpage CTA を出すか (storybook design preview 専用、production では
   * subpage 未実装なので default false)。 */
  enableSubpageLinks?: boolean;
};

const SCOPE_COLOR = {
  network: "text-blue-600",
  activity: "text-orange-600",
  user: "text-emerald-600",
} as const;

/**
 * 4 階層スコープ (コミュニティ ⊃ ネットワーク ⊃ アクティビティ ⊃ ユーザー)
 * を Apple Health 風 の塗りカードで縦積みした overview。各 metric が独立
 * カードで、icon + タイトル(scope 色) + meta(右上) + 大きな数値 + mini viz
 * (ring / sparkline / なし) という統一フォーマット。未計測は同 shell で
 * 「未計測」テキストのみ。
 */
export function CommunityDashboardOverview({
  data,
  hubMemberCount,
  communityName,
  newMemberCount,
  enableSubpageLinks = false,
}: Props) {
  const summary = data.summary;
  const totalMembers = summary.totalMembers;
  const stages = data.stages;
  const habitualCount = stages.habitual.count;
  const regularCount = stages.regular.count;
  const latentCount = stages.latent.count;

  const isolatedCount = data.memberList.users.filter(
    (u) => u.userSendRate >= 0.7 && u.uniqueDonationRecipients <= 1,
  ).length;

  const hubProvided = hubMemberCount !== undefined;
  const hubPct = hubProvided && totalMembers > 0 ? hubMemberCount / totalMembers : 0;
  const isolatedRatio = habitualCount > 0 ? isolatedCount / habitualCount : 0;
  const isolatedAlert = habitualCount > 0 && isolatedRatio >= 0.3;

  const activeMembers = data.memberList.users.filter((u) => u.userSendRate > 0);
  const avgRecipients =
    activeMembers.length > 0
      ? activeMembers.reduce((acc, u) => acc + u.uniqueDonationRecipients, 0) /
        activeMembers.length
      : 0;
  // memberList は totalPointsOut DESC で top N (limit=50) のみ。L2 payload
  // が community 全体の tenureDistribution を露出するまでの暫定で、上位
  // 寄与者の中での比率という偏った近似になる (donor は長期在籍に偏る)。
  const loadedUserCount = data.memberList.users.length;
  const tenuredRatio =
    loadedUserCount > 0
      ? data.memberList.users.filter((u) => u.daysIn >= TENURE_THRESHOLD_DAYS)
          .length / loadedUserCount
      : null;

  // 連鎖率 (今月) — monthlyActivityTrend の最新点
  const latestMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 1];
  const latestChainPct = latestMonth?.chainPct ?? null;

  // 流通量 MoM
  const prevMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 2];
  const donationMoM =
    latestMonth && prevMonth && prevMonth.donationPointsSum > 0
      ? (latestMonth.donationPointsSum - prevMonth.donationPointsSum) /
        prevMonth.donationPointsSum
      : null;

  // 平均月次流通 = 累計 / 月数
  const avgMonthlyThroughput =
    summary.totalDonationPointsAllTime > 0 && data.monthlyActivityTrend.length > 0
      ? summary.totalDonationPointsAllTime / data.monthlyActivityTrend.length
      : null;

  // 流通量集中度 (Pareto)
  const paretoTopShare = computeParetoTopShare(activeMembers, 0.8);

  // 週次継続率: retentionTrend の最新週から
  const latestWeek = data.retentionTrend[data.retentionTrend.length - 1];
  const weeklyContinuationRate =
    latestWeek && latestWeek.retainedSenders + latestWeek.churnedSenders > 0
      ? latestWeek.retainedSenders /
        (latestWeek.retainedSenders + latestWeek.churnedSenders)
      : null;

  const cohortLatest = data.cohortRetention[data.cohortRetention.length - 1];
  const cohortPrev = data.cohortRetention[data.cohortRetention.length - 2];
  const cohortDelta =
    cohortLatest?.retentionM1 != null && cohortPrev?.retentionM1 != null
      ? cohortLatest.retentionM1 - cohortPrev.retentionM1
      : null;
  const cohortAlert = cohortDelta != null && cohortDelta <= -0.05;

  const habitualOverRegular = habitualCount > 0 && regularCount > habitualCount;

  // 新規率 (28d)
  const newRate =
    totalMembers > 0 && newMemberCount != null
      ? newMemberCount / totalMembers
      : null;

  const ageMonths =
    summary.dataFrom && summary.dataTo
      ? Math.round(
          (summary.dataTo.getTime() - summary.dataFrom.getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        )
      : null;

  // sparkline data
  const mauSeries = data.monthlyActivityTrend
    .map((m) => m.communityActivityRate)
    .filter((v): v is number => v != null);
  const throughputSeries = data.monthlyActivityTrend.map(
    (m) => m.donationPointsSum,
  );

  return (
    <div className="flex flex-col gap-6">
      {communityName && (
        <header className="flex flex-col gap-1">
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
                <span className="text-xs">
                  (+{toIntJa(newMemberCount)} 今月)
                </span>
              )}
            </div>
          </div>
          <CommunityBand
            ageMonths={ageMonths}
            avgMonthlyThroughput={avgMonthlyThroughput}
            avgMonthlyPerMember={
              avgMonthlyThroughput != null && totalMembers > 0
                ? avgMonthlyThroughput / totalMembers
                : null
            }
          />
        </header>
      )}

      <Scope
        title="ネットワーク"
        detailHref={
          enableSubpageLinks ? `/sysAdmin/${data.communityId}/network` : undefined
        }
      >
        <MetricCard
          icon={Network}
          colorClass={SCOPE_COLOR.network}
          title="ハブユーザー比率"
          meta="今月"
          status={hubProvided ? "ok" : "todo"}
          hero={hubProvided ? <Hero value={toPct(hubPct)} /> : undefined}
          viz={
            hubProvided ? (
              <Ring value={hubPct} colorClass={SCOPE_COLOR.network} />
            ) : undefined
          }
        />
        <MetricCard
          icon={Send}
          colorClass={SCOPE_COLOR.network}
          title="平均送付先数"
          meta="累計"
          hero={
            <Hero
              value={avgRecipients > 0 ? avgRecipients.toFixed(1) : "-"}
              unit="人"
            />
          }
        />
        <MetricCard
          icon={Link2}
          colorClass={SCOPE_COLOR.network}
          title="連鎖率"
          meta="今月"
          hero={
            <Hero
              value={latestChainPct != null ? toPct(latestChainPct) : "-"}
            />
          }
          viz={
            latestChainPct != null ? (
              <Ring value={latestChainPct} colorClass={SCOPE_COLOR.network} />
            ) : undefined
          }
        />
        <MetricCard
          icon={PieChart}
          colorClass={SCOPE_COLOR.network}
          title="流通量の偏り"
          meta="累計"
          hero={
            paretoTopShare != null ? (
              <Hero
                prefix="上位"
                value={toPct(paretoTopShare)}
              />
            ) : (
              <Hero value="-" />
            )
          }
          viz={
            paretoTopShare != null ? (
              <Ring
                value={paretoTopShare}
                colorClass={SCOPE_COLOR.network}
              />
            ) : undefined
          }
        />

        {isolatedAlert && (
          <Issue title="送付先の孤立">
            習慣化層 {habitualCount} 名のうち {isolatedCount} 名 (
            {toPct(isolatedRatio)}) が単一相手のみ。送付先の多様化が改善ポイント。
          </Issue>
        )}
      </Scope>

      <Scope
        title="アクティビティ"
        detailHref={enableSubpageLinks ? `/sysAdmin/${data.communityId}/activity` : undefined}
      >
        <MetricCard
          icon={Activity}
          colorClass={SCOPE_COLOR.activity}
          title="今月の MAU%"
          meta="今月"
          hero={
            <Hero
              value={
                <span className="inline-flex items-baseline gap-2">
                  <span>{toPct(summary.communityActivityRate)}</span>
                  {summary.growthRateActivity != null && (
                    <PercentDelta
                      value={summary.growthRateActivity}
                      className="text-sm"
                    />
                  )}
                </span>
              }
            />
          }
          viz={
            mauSeries.length > 1 ? (
              <Sparkline
                data={mauSeries}
                colorClass={SCOPE_COLOR.activity}
              />
            ) : undefined
          }
        />
        <MetricCard
          icon={Repeat}
          colorClass={SCOPE_COLOR.activity}
          title="週次継続率"
          meta="直近週"
          hero={
            <Hero
              value={
                weeklyContinuationRate != null
                  ? toPct(weeklyContinuationRate)
                  : "-"
              }
            />
          }
          viz={
            weeklyContinuationRate != null ? (
              <Ring
                value={weeklyContinuationRate}
                colorClass={SCOPE_COLOR.activity}
              />
            ) : undefined
          }
        />
        <MetricCard
          icon={CalendarCheck}
          colorClass={SCOPE_COLOR.activity}
          title="最新コホート M+1"
          meta={
            cohortLatest?.cohortMonth
              ? formatYearMonth(cohortLatest.cohortMonth)
              : "-"
          }
          hero={
            <Hero
              value={
                cohortLatest?.retentionM1 != null
                  ? toPct(cohortLatest.retentionM1)
                  : "-"
              }
            />
          }
          viz={
            cohortLatest?.retentionM1 != null ? (
              <Ring
                value={cohortLatest.retentionM1}
                colorClass={SCOPE_COLOR.activity}
              />
            ) : undefined
          }
        />
        <MetricCard
          icon={TrendingUp}
          colorClass={SCOPE_COLOR.activity}
          title="流通量 MoM"
          meta="今月 vs 前月"
          hero={
            donationMoM != null ? (
              <Hero
                value={
                  <PercentDelta
                    value={donationMoM}
                    className="text-4xl tracking-tight"
                  />
                }
              />
            ) : (
              <Hero value="-" />
            )
          }
          viz={
            throughputSeries.length > 1 ? (
              <Sparkline
                data={throughputSeries}
                colorClass={SCOPE_COLOR.activity}
              />
            ) : undefined
          }
        />

        {cohortAlert && cohortLatest?.retentionM1 != null && (
          <Issue title="直近コホートの M+1 低下">
            最新月 {toPct(cohortLatest.retentionM1)}
            {cohortPrev?.retentionM1 != null &&
              ` (前期 ${toPct(cohortPrev.retentionM1)})`}
            。Onboarding が機能していない可能性。
          </Issue>
        )}
      </Scope>

      <Scope
        title="ユーザー"
        detailHref={enableSubpageLinks ? `/sysAdmin/${data.communityId}/users` : undefined}
      >
        <MetricCard
          icon={Star}
          colorClass={SCOPE_COLOR.user}
          title="習慣化率"
          meta="現在"
          hero={<Hero value={toPct(stages.habitual.pct)} />}
          viz={
            <Ring value={stages.habitual.pct} colorClass={SCOPE_COLOR.user} />
          }
        />
        <MetricCard
          icon={UserPlus}
          colorClass={SCOPE_COLOR.user}
          title="新規率"
          meta="直近 28 日"
          hero={<Hero value={newRate != null ? toPct(newRate) : "-"} />}
        />
        <MetricCard
          icon={Hourglass}
          colorClass={SCOPE_COLOR.user}
          title="3 ヶ月以上 在籍率"
          meta="送付者上位"
          hero={
            <Hero value={tenuredRatio != null ? toPct(tenuredRatio) : "-"} />
          }
          viz={
            tenuredRatio != null ? (
              <Ring value={tenuredRatio} colorClass={SCOPE_COLOR.user} />
            ) : undefined
          }
        />
        <MetricCard
          icon={Moon}
          colorClass={SCOPE_COLOR.user}
          title="休眠化率"
          status="todo"
        />

        {habitualOverRegular && (
          <Issue title="「定期」が「習慣化」を超過">
            定期 {regularCount} 名 が 習慣化 {habitualCount} 名 を上回っている。中堅層の習慣化に伸びしろ。
          </Issue>
        )}
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
    <section className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-lg font-semibold">{title}</h2>
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
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  colorClass,
  title,
  meta,
  hero,
  viz,
  status = "ok",
}: {
  icon: LucideIcon;
  colorClass: string;
  title: string;
  meta?: string;
  hero?: React.ReactNode;
  viz?: React.ReactNode;
  status?: "ok" | "todo";
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-5">
      <header className="flex items-center justify-between gap-3">
        <div className={cn("flex items-center gap-1.5 text-sm font-medium", colorClass)}>
          <Icon className="h-4 w-4" aria-hidden />
          <span>{title}</span>
        </div>
        {meta && (
          <span className="text-xs text-muted-foreground">{meta}</span>
        )}
      </header>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {status === "todo" ? (
            <span className="text-base text-muted-foreground">未計測</span>
          ) : (
            hero
          )}
        </div>
        {status === "ok" && viz && <div className="shrink-0">{viz}</div>}
      </div>
    </div>
  );
}

function Hero({
  prefix,
  value,
  unit,
}: {
  prefix?: string;
  value: React.ReactNode;
  unit?: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1 text-4xl font-semibold tabular-nums leading-none tracking-tight">
      {prefix && (
        <span className="text-xs font-normal text-muted-foreground">
          {prefix}
        </span>
      )}
      {value}
      {unit && (
        <span className="text-base font-medium text-muted-foreground">
          {unit}
        </span>
      )}
    </span>
  );
}

function Ring({
  value,
  colorClass,
  size = 48,
  stroke = 5,
}: {
  /** 0–1 範囲。範囲外は clamp。 */
  value: number;
  colorClass: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = circumference * (1 - clamped);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        className="text-muted-foreground/15"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={colorClass}
      />
    </svg>
  );
}

function Sparkline({
  data,
  colorClass,
  width = 76,
  height = 30,
}: {
  data: number[];
  colorClass: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const padY = 2;
  const usableH = height - padY * 2;
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = padY + usableH - ((v - min) / range) * usableH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={colorClass}
      />
    </svg>
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
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-amber-900">{title}</p>
        <p className="text-sm leading-relaxed text-amber-900/80">{children}</p>
      </div>
    </div>
  );
}

function CommunityBand({
  ageMonths,
  avgMonthlyThroughput,
  avgMonthlyPerMember,
}: {
  ageMonths: number | null;
  avgMonthlyThroughput: number | null;
  /** 規模補正 = avgMonthlyThroughput / totalMembers。civicship 哲学的に
   * 「コミュニティ全体の絶対額」より「メンバー 1 人あたりの月次活動量」が
   * 比較可能で意味がある。 */
  avgMonthlyPerMember: number | null;
}) {
  const parts: string[] = [];
  if (ageMonths != null) parts.push(`活動 ${ageMonths} ヶ月`);
  if (avgMonthlyThroughput != null)
    parts.push(`月次 ${toCompactJa(avgMonthlyThroughput)} pt`);
  if (avgMonthlyPerMember != null)
    parts.push(`1 人あたり ${toCompactJa(avgMonthlyPerMember)} pt/月`);
  return (
    <p className="text-xs text-muted-foreground tabular-nums">
      {parts.join(" · ")}
    </p>
  );
}

function computeParetoTopShare(
  users: ReadonlyArray<{ totalPointsOut: number }>,
  coverage: number,
): number | null {
  if (users.length === 0) return null;
  const sorted = [...users].sort((a, b) => b.totalPointsOut - a.totalPointsOut);
  const total = sorted.reduce((acc, u) => acc + u.totalPointsOut, 0);
  if (total === 0) return null;
  let cumulative = 0;
  for (let i = 0; i < sorted.length; i++) {
    cumulative += sorted[i].totalPointsOut;
    if (cumulative / total >= coverage) {
      return (i + 1) / sorted.length;
    }
  }
  return 1;
}

function formatYearMonth(d: Date): string {
  // JST 相対の表記。Date がそのまま JST 寄り想定 (codegen scalar Datetime → Date)。
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}年${m}月`;
}
