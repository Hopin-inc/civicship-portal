"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  ChevronRight,
  Hourglass,
  type LucideIcon,
  Moon,
  Network,
  PieChart,
  Repeat,
  RotateCw,
  Send,
  Star,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  GqlGetAnalyticsCommunityQuery,
  GqlAnalyticsTenureDistribution,
} from "@/types/graphql";
import {
  toCompactJa,
  toIntJa,
  toPct,
} from "@/app/sysAdmin/_shared/format/number";
import { HistoryBars } from "@/app/sysAdmin/_shared/components/HistoryBars";
import type { MetricKey } from "@/app/sysAdmin/_shared/components/MetricDefinitions";
import { MetricInfoButton } from "@/app/sysAdmin/_shared/components/MetricInfoButton";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import {
  TenureBar,
  deriveTenuredRatio,
} from "@/app/sysAdmin/_shared/components/TenureBar";
import {
  TENURE_THRESHOLD_DAYS,
  deriveDormantRate,
} from "@/app/sysAdmin/_shared/derive";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type DetailPayload = NonNullable<
  GqlGetAnalyticsCommunityQuery["analyticsCommunity"]
>;

type Props = {
  data: DetailPayload;
  /** L1 dashboard 経由で取得した hub メンバー数。L2 schema 未掲載のため
   * page.tsx 側で L1 と並列 fetch して受け渡す。未指定なら「未実装」表示。 */
  hubMemberCount?: number;
  communityName?: string;
  newMemberCount?: number;
  /** L1 dashboard で取得した community-wide の在籍分布。L2 payload に
   * 直接乗っていないため、page.tsx 側で L1 と並列 fetch して受け渡す。
   * 未指定の場合は memberList の上位寄与者ベースで近似する。 */
  tenureDistribution?: GqlAnalyticsTenureDistribution;
  /** subpage CTA を出すか (storybook design preview 専用、production では
   * subpage 未実装なので default false)。 */
  enableSubpageLinks?: boolean;
  /**
   * レンダリング範囲。
   * - "full" (default): 全体 (header + funnel + scopes)
   * - "summary": community ヘッダーと funnel まで (タブ「上」に常時表示用)
   * - "details": funnel より下の scope 群 (タブ「下」用)
   */
  slot?: "full" | "summary" | "details";
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
 * (ring / sparkline / なし) という統一フォーマット。未実装は同 shell で
 * 「未実装」テキストのみ。
 */
export function CommunityDashboardOverview({
  data,
  hubMemberCount,
  communityName,
  newMemberCount,
  tenureDistribution,
  enableSubpageLinks = false,
  slot = "full",
}: Props) {
  // Schema 上は summary / stages / memberList とその nested buckets は全て
  // non-null だが、production の partial response (network エラー後の
  // Apollo cache 残り、ロールアウト中の backend 不整合 等) で undefined に
  // 落ちるケースを観測している。crash させずに「データ取得に失敗」を出す
  // ように防御。warn を出して原因が手元でも追えるようにする。
  if (
    !data.summary ||
    !data.stages?.habitual ||
    !data.stages?.regular ||
    !data.stages?.occasional ||
    !data.stages?.latent ||
    !data.memberList ||
    !data.monthlyActivityTrend ||
    !data.retentionTrend ||
    !data.cohortRetention
  ) {
    if (typeof window !== "undefined") {
      // stg は NODE_ENV=production なので env 判定を入れずに常に warn を
      // 出して原因究明に使う。
      // eslint-disable-next-line no-console
      console.warn("[CommunityDashboardOverview] missing required fields", {
        hasSummary: !!data.summary,
        hasHabitual: !!data.stages?.habitual,
        hasRegular: !!data.stages?.regular,
        hasOccasional: !!data.stages?.occasional,
        hasLatent: !!data.stages?.latent,
        hasMemberList: !!data.memberList,
        hasMonthlyActivityTrend: !!data.monthlyActivityTrend,
        hasRetentionTrend: !!data.retentionTrend,
        hasCohortRetention: !!data.cohortRetention,
      });
    }
    // slot="details" のときは error バナーを描画しない。
    // CommunityDetailPageClient が summary と details の 2 回 render するため、
    // そのまま両方で出すとバナーが画面に 2 つ並んでしまう。summary 側が必ず
    // 先に render されるので、そこに集約する。
    if (slot === "details") return null;
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 text-sm text-amber-900">
        コミュニティ詳細データの一部が取得できませんでした。時間をおいて再度お試しください。
      </div>
    );
  }

  const summary = data.summary;
  const totalMembers = summary.totalMembers;
  const stages = data.stages;
  const habitualCount = stages.habitual.count;
  const regularCount = stages.regular.count;
  const latentCount = stages.latent.count;

  const hubProvided = hubMemberCount !== undefined;
  const hubPct = hubProvided && totalMembers > 0 ? hubMemberCount / totalMembers : 0;

  const activeMembers = data.memberList.users.filter((u) => u.userSendRate > 0);
  const avgRecipients =
    activeMembers.length > 0
      ? activeMembers.reduce((acc, u) => acc + u.uniqueDonationRecipients, 0) /
        activeMembers.length
      : 0;

  // 受領→送付 転換率 (互酬到達率): 受領経験者のうち送付経験もある人の比率。
  // ギフトエコノミーが配給型 (一方通行) か相互参加型かの本質指標。
  //
  // memberList は totalPointsOut DESC で並ぶため、limit に達していると
  // 「受領のみで送付なし (totalPointsOut == 0)」のメンバーが末尾で切り捨て
  // られ、分母 (受領経験者) が過小評価されて転換率が実態より高く出る。
  // hasNextPage が立っているときは undersampled なので null を返し、UI 側で
  // 全件取得 (cursor pagination) を実装するか server-side 集計 (Option B) を
  // backend に追加するまで値を出さない。
  const memberSampleComplete = !data.memberList.hasNextPage;
  const recipientsAll = memberSampleComplete
    ? data.memberList.users.filter((u) => u.totalPointsIn > 0)
    : [];
  const recipientSenders = recipientsAll.filter((u) => u.totalPointsOut > 0);
  const recipientToSenderRate =
    memberSampleComplete && recipientsAll.length > 0
      ? recipientSenders.length / recipientsAll.length
      : null;
  // 「3 ヶ月以上 在籍率」は community 全体の tenureDistribution から計算する
  // のが正。L1 dashboard 経由で受け取った distribution があればそれを使い、
  // 無ければ memberList (totalPointsOut DESC top N) で近似する暫定 fallback。
  // fallback は donor 偏重で長期在籍に偏るので「上位寄与者ベース」と注記。
  const tenuredRatio: number | null = tenureDistribution
    ? deriveTenuredRatio(tenureDistribution)
    : data.memberList.users.length > 0
      ? data.memberList.users.filter((u) => u.daysIn >= TENURE_THRESHOLD_DAYS)
          .length / data.memberList.users.length
      : null;
  const tenuredFromCommunity = tenureDistribution != null;

  const latestMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 1];

  // 流通量 MoM
  const prevMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 2];
  const donationMoM =
    latestMonth && prevMonth && prevMonth.donationPointsSum > 0
      ? (latestMonth.donationPointsSum - prevMonth.donationPointsSum) /
        prevMonth.donationPointsSum
      : null;

  // codegen の scalar mapping は `Datetime: Date` だが Apollo に scalar
  // deserializer は無く、SSR / network から JSON で来るのは ISO 文字列。
  // 直接 `.getTime()` を呼ぶと runtime で TypeError なので必ず Date でラップ。
  const ageMonths =
    summary.dataFrom && summary.dataTo
      ? Math.round(
          (new Date(summary.dataTo).getTime() -
            new Date(summary.dataFrom).getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        )
      : null;

  // 平均月次流通 = 累計 / コミュニティ稼働月数。monthlyActivityTrend.length
  // は windowMonths (default 3) で頭打ちなので、それを分母にすると長く稼働
  // している community ほど見かけ上膨れる (24 ヶ月稼働なら 8 倍)。
  // dataFrom→dataTo から導いた ageMonths を必ず使う。
  const avgMonthlyThroughput =
    summary.totalDonationPointsAllTime > 0 && ageMonths != null && ageMonths > 0
      ? summary.totalDonationPointsAllTime / ageMonths
      : null;

  // 流通量集中度 (Pareto)
  const paretoTopShare = computeParetoTopShare(activeMembers, 0.8);

  // 週次送付継続率: retentionTrend の最新週から
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

  // 新規定着率 (D30 相当): cohortRetention.retentionM1 = 「entry month の翌月に
  // DONATION out した cohort の比率」。最新コホートは m+1 が未完了で null に
  // なりがちなので、retentionM1 != null の直近 N コホートの平均を取る。
  // 「新規が ~30-60 日以内に送付した率」のシグナル。
  const D30_COHORT_WINDOW = 3;
  const completedCohorts = data.cohortRetention.filter(
    (c) => c.retentionM1 != null,
  );
  const recentCompletedCohorts = completedCohorts.slice(-D30_COHORT_WINDOW);
  const d30ActivationRate =
    recentCompletedCohorts.length > 0
      ? recentCompletedCohorts.reduce((acc, c) => acc + (c.retentionM1 ?? 0), 0) /
        recentCompletedCohorts.length
      : null;

  const habitualOverRegular = habitualCount > 0 && regularCount > habitualCount;

  // 新規率 (最新月): newMemberCount は L2 detail の monthlyActivityTrend
  // 最新点 (calendar-month) から渡ってくるので 28 日 rolling 窓ではない。
  const newRate =
    totalMembers > 0 && newMemberCount != null
      ? newMemberCount / totalMembers
      : null;

  const dormantRate = deriveDormantRate({
    totalMembers: summary.totalMembers,
    dormantCount: data.dormantCount,
  });

  // 復帰率 (月次): 「先月末時点で休眠だった人のうち、今月送付した人の比率」。
  // 分子は今月点の returnedMembers、分母は前月点の dormantCount。
  // 直前月が無い (series 最初) / returnedMembers が null / 前月 dormantCount が
  // 0 のいずれかで null。
  const prevMonthForRecovery =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 2];
  const recoveryRate =
    latestMonth?.returnedMembers != null &&
    prevMonthForRecovery != null &&
    prevMonthForRecovery.dormantCount > 0
      ? latestMonth.returnedMembers / prevMonthForRecovery.dormantCount
      : null;

  // 12 期間 footer chart 用の time-series。各カードの動的シグナルを統一表示
  // するために `HistoryBars` (棒グラフ) に流す。null は backend が「この月は
  // データ範囲外」を示すマーカーで、HistoryBars 側は描画スキップで gap として
  // 残す ─ value が 0 (= 実データだが値ゼロ) と区別する。
  const mauSeries = data.monthlyActivityTrend.map((m) => m.communityActivityRate);
  const throughputSeries = data.monthlyActivityTrend.map(
    (m) => m.donationPointsSum,
  );
  const newMembersSeries = data.monthlyActivityTrend.map((m) => m.newMembers);
  const dormantSeries = data.monthlyActivityTrend.map((m) => m.dormantCount);
  const hubSeries = data.monthlyActivityTrend.map((m) => m.hubMemberCount);

  // 復帰率 月次推移: returnedMembers[N] / dormantCount[N-1]。先月データなし or
  // 分母 0 のセルは null (gap 表示) に倒す。
  const recoverySeries = data.monthlyActivityTrend.map((m, i, arr) => {
    if (i === 0) return null;
    const prev = arr[i - 1];
    if (m.returnedMembers == null || prev.dormantCount === 0) return null;
    return m.returnedMembers / prev.dormantCount;
  });

  // 週次送付継続率 series: 直近 12 週の retainedSenders / (retained + churned)。
  const weeklyContinuationSeries = data.retentionTrend
    .slice(-12)
    .map((w) => {
      const total = w.retainedSenders + w.churnedSenders;
      return total > 0 ? w.retainedSenders / total : null;
    });

  // D30 series: 直近 6 cohort の retentionM1。最新 cohort は M+1 未完了で null
  // の可能性が高いが、null は HistoryBars 側で gap 表示するので問題なし。
  const d30Series = data.cohortRetention.slice(-6).map((c) => c.retentionM1);

  // アクティベーション・ファネル (送付軸 3 ステージ、コミュニティ全体)。
  // 分母は totalMembers (= 加入 100%) を暗黙の baseline として使い、ファネル
  // としては「加入」段は描画しない (header band の "385 名" 表示で既知)。
  //   送付 = 1 回でも送付した (= latent ではない人)
  //   継続 = 2 ヶ月以上送付した (memberList から count)
  //   定着 = stages.habitual segment (= card「定着率」と同じ概念)
  // memberList は totalPointsOut DESC で limit=1000 のため、totalMembers が
  // 1000 を超える community では 継続 が過小評価されうる (sampleDependent フラグ
  // で明示)。送付 / 定着 は server-aggregate で bias なし。
  const funnelDenominator = totalMembers;
  const funnelStages = [
    {
      label: "送付",
      count: Math.max(0, totalMembers - stages.latent.count),
      sampleDependent: false,
    },
    {
      label: "継続",
      count: data.memberList.users.filter((u) => u.donationOutMonths >= 2).length,
      sampleDependent: true,
    },
    {
      label: "定着",
      count: habitualCount,
      sampleDependent: false,
    },
  ];

  const showSummary = slot === "full" || slot === "summary";
  const showDetails = slot === "full" || slot === "details";

  return (
    <div className="flex flex-col gap-3">
      {showSummary && communityName && (
        // px-1: ネットワーク等 scope 見出し (px-1) と左揃え。
        <header className="flex flex-col gap-1 px-1">
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

      {showSummary && (
        // highlight: アクティベーション・ファネル。L2 単一値カードでは見え
        // にくい「ステージ間の脱落幅」を 1 枚で読ませる。 cohortFunnel での
        // 詳細 (cohort 別比較) は L3 /activity 行き。
        <ActivationFunnelCard
          denominator={funnelDenominator}
          stages={funnelStages}
          memberSampleComplete={memberSampleComplete}
          detailHref={
            enableSubpageLinks ? `/sysAdmin/${data.communityId}/activity#funnel` : undefined
          }
        />
      )}

      {showDetails && (
      <>
      {/* state group: 関係 (Network) + 個人 (Member) を上に。
          いずれも累計 / 現在の構造を表す snapshot 系メトリクス。 */}
      <div className="flex flex-col gap-6">
        <Scope
          title="ネットワーク"
          note={sysAdminDashboardJa.scopeNotes.network}
          detailHref={
            enableSubpageLinks ? `/sysAdmin/${data.communityId}/network` : undefined
          }
        >
          <MetricCard
            icon={Network}
            colorClass={SCOPE_COLOR.network}
            title="ハブユーザー比率"
            meta="今月"
            infoMetricKey="hubUserPct"
            status={hubProvided ? "ok" : "todo"}
            hero={hubProvided ? <Hero value={toPct(hubPct)} /> : undefined}
            viz={
              hubProvided ? (
                <Ring value={hubPct} colorClass={SCOPE_COLOR.network} />
              ) : undefined
            }
            footer={
              hubProvided ? (
                <HistoryBars
                  data={hubSeries}
                  colorClass={SCOPE_COLOR.network}
                />
              ) : undefined
            }
          />
          <MetricCard
            icon={Send}
            colorClass={SCOPE_COLOR.network}
            title="平均送付先数"
            meta="累計"
            infoMetricKey="avgRecipients"
            hero={
              <Hero
                value={avgRecipients > 0 ? avgRecipients.toFixed(1) : "-"}
                unit="人"
              />
            }
          />
          {/* 受領→送付 転換率: 受領経験者のうち送付経験もある人の比率。
              ギフトエコノミーにおける互酬到達率。memberList から
              totalPointsIn / totalPointsOut で client-side 集計。 */}
          <MetricCard
            icon={ArrowLeftRight}
            colorClass={SCOPE_COLOR.network}
            title="受領→送付 転換率"
            meta={memberSampleComplete ? "累計" : "サンプル不足"}
            infoMetricKey="recipientToSenderRate"
            hero={
              <Hero
                value={
                  recipientToSenderRate != null
                    ? toPct(recipientToSenderRate)
                    : "-"
                }
              />
            }
            viz={
              recipientToSenderRate != null ? (
                <Ring
                  value={recipientToSenderRate}
                  colorClass={SCOPE_COLOR.network}
                />
              ) : undefined
            }
          />
          <MetricCard
            icon={PieChart}
            colorClass={SCOPE_COLOR.network}
            title="流通量の偏り"
            meta="累計"
            infoMetricKey="paretoTopShare"
            hero={
              paretoTopShare != null ? (
                <Hero prefix="上位" value={toPct(paretoTopShare)} />
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
        </Scope>

        <Scope
          title="ユーザー"
          note={sysAdminDashboardJa.scopeNotes.user}
          detailHref={
            enableSubpageLinks ? `/sysAdmin/${data.communityId}/users` : undefined
          }
        >
          <MetricCard
            icon={Star}
            colorClass={SCOPE_COLOR.user}
            title="定着率"
            meta="現在"
            infoMetricKey="habitualPct"
            hero={<Hero value={toPct(stages.habitual.pct)} />}
            viz={
              <Ring value={stages.habitual.pct} colorClass={SCOPE_COLOR.user} />
            }
          />
          <MetricCard
            icon={UserPlus}
            colorClass={SCOPE_COLOR.user}
            title="新規率"
            meta="最新月"
            infoMetricKey="newRate"
            hero={<Hero value={newRate != null ? toPct(newRate) : "-"} />}
            footer={
              <HistoryBars
                data={newMembersSeries}
                colorClass={SCOPE_COLOR.user}
              />
            }
          />
          <MetricCard
            icon={Hourglass}
            colorClass={SCOPE_COLOR.user}
            title="3 ヶ月以上 在籍率"
            meta={
              tenuredFromCommunity ? "コミュニティ全体" : "上位寄与者ベース (暫定)"
            }
            infoMetricKey="tenuredRatio"
            hero={
              <Hero value={tenuredRatio != null ? toPct(tenuredRatio) : "-"} />
            }
            viz={
              tenuredRatio != null ? (
                <Ring value={tenuredRatio} colorClass={SCOPE_COLOR.user} />
              ) : undefined
            }
            footer={
              tenureDistribution ? (
                <TenureBar distribution={tenureDistribution} />
              ) : undefined
            }
          />
          <MetricCard
            icon={Moon}
            colorClass={SCOPE_COLOR.user}
            title="休眠化率"
            meta="直近 30 日"
            infoMetricKey="dormantRate"
            hero={
              <Hero value={dormantRate != null ? toPct(dormantRate) : "-"} />
            }
            viz={
              dormantRate != null ? (
                <Ring value={dormantRate} colorClass={SCOPE_COLOR.user} />
              ) : undefined
            }
            footer={
              <HistoryBars
                data={dormantSeries}
                colorClass={SCOPE_COLOR.user}
              />
            }
          />

          {habitualOverRegular && (
            <Issue title="「定期」が「定着」を超過">
              定期 {regularCount} 名 が 定着 {habitualCount} 名 を上回っている。中堅層の定着に伸びしろ。
            </Issue>
          )}
        </Scope>
      </div>

      <Scope
        title="アクティビティ"
        note={sysAdminDashboardJa.scopeNotes.activity}
        detailHref={
          enableSubpageLinks ? `/sysAdmin/${data.communityId}/activity` : undefined
        }
      >
        <MetricCard
          icon={Activity}
          colorClass={SCOPE_COLOR.activity}
          title="今月の MAU%"
          meta="今月"
          infoMetricKey="communityActivityRate"
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
          footer={
            <HistoryBars data={mauSeries} colorClass={SCOPE_COLOR.activity} />
          }
        />
        <MetricCard
          icon={Repeat}
          colorClass={SCOPE_COLOR.activity}
          title="週次送付継続率"
          meta="直近週"
          infoMetricKey="weeklySenderContinuationRate"
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
          footer={
            <HistoryBars
              data={weeklyContinuationSeries}
              colorClass={SCOPE_COLOR.activity}
            />
          }
        />
        {/* 初回送付率 (D30 相当): 直近完了 N コホートの retentionM1 平均。
            最新コホートは m+1 が未完了で null になるため、完了済みのみ集計。
            ファネル末段の「定着」(= habitual segment、card「定着率」) と
            意味が違うので「初回送付」という別名で区別する。 */}
        <MetricCard
          icon={Zap}
          colorClass={SCOPE_COLOR.activity}
          title="初回送付率"
          meta={
            recentCompletedCohorts.length > 0
              ? `直近 ${recentCompletedCohorts.length} コホート平均`
              : "完了コホートなし"
          }
          infoMetricKey="newD30ActivationRate"
          hero={
            <Hero
              value={
                d30ActivationRate != null ? toPct(d30ActivationRate) : "-"
              }
            />
          }
          viz={
            d30ActivationRate != null ? (
              <Ring
                value={d30ActivationRate}
                colorClass={SCOPE_COLOR.activity}
              />
            ) : undefined
          }
          footer={
            <HistoryBars data={d30Series} colorClass={SCOPE_COLOR.activity} />
          }
        />
        <MetricCard
          icon={TrendingUp}
          colorClass={SCOPE_COLOR.activity}
          title="流通量 MoM"
          meta="今月 vs 前月"
          infoMetricKey="donationMoM"
          hero={
            donationMoM != null ? (
              <Hero
                value={
                  <PercentDelta
                    value={donationMoM}
                    // 緑/赤の sign-based coloring を抑制して default の text
                    // 色 (foreground) で出す。流通量 MoM は hero がそのまま
                    // 大数字なので、green/red で色付けすると他カードの落ち着き
                    // と齟齬が出るため。
                    className="text-4xl tracking-tight text-foreground"
                    arrowClassName="mr-1 align-baseline text-xl font-medium"
                  />
                }
              />
            ) : (
              <Hero value="-" />
            )
          }
          footer={
            <HistoryBars
              data={throughputSeries}
              colorClass={SCOPE_COLOR.activity}
            />
          }
        />
        {/* 復帰率: 今月 returnedMembers / 前月 dormantCount。
            両方とも monthlyActivityTrend から server 計算済の値を取る。 */}
        <MetricCard
          icon={RotateCw}
          colorClass={SCOPE_COLOR.activity}
          title="復帰率"
          meta="先月休眠 → 今月活動"
          infoMetricKey="recoveryRate"
          hero={
            <Hero value={recoveryRate != null ? toPct(recoveryRate) : "-"} />
          }
          viz={
            recoveryRate != null ? (
              <Ring value={recoveryRate} colorClass={SCOPE_COLOR.activity} />
            ) : undefined
          }
          footer={
            <HistoryBars
              data={recoverySeries}
              colorClass={SCOPE_COLOR.activity}
            />
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
      </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------

function Scope({
  title,
  detailHref,
  note,
  children,
  className,
}: {
  title: string;
  detailHref?: string;
  /** 見出し直下に muted で表示する短い読み方ガイド (各 ~100 字)。 */
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <header className="flex flex-col gap-1.5 px-1">
        <div className="flex items-baseline justify-between gap-3">
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
        </div>
        {note && (
          <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
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
  footer,
  status = "ok",
  infoMetricKey,
}: {
  icon: LucideIcon;
  colorClass: string;
  title: string;
  meta?: string;
  hero?: React.ReactNode;
  viz?: React.ReactNode;
  /** hero 行の下に積む補足 viz (在籍分布 mini bar など)。 */
  footer?: React.ReactNode;
  status?: "ok" | "todo";
  /** 指定すると header の右側 meta の隣に Info icon を出して、tap で
   * 該当指標の定義 popover を開く。MetricDefinitions の key を渡す。 */
  infoMetricKey?: MetricKey;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-5">
      <header className="flex items-center justify-between gap-3">
        <div className={cn("flex items-center gap-1.5 text-sm font-medium", colorClass)}>
          <Icon className="h-4 w-4" aria-hidden />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {meta && (
            <span className="text-xs text-muted-foreground">{meta}</span>
          )}
          {infoMetricKey && <MetricInfoButton metricKey={infoMetricKey} />}
        </div>
      </header>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          {status === "todo" ? (
            <span className="text-base text-muted-foreground">未実装</span>
          ) : (
            hero
          )}
        </div>
        {status === "ok" && viz && <div className="shrink-0">{viz}</div>}
      </div>
      {status === "ok" && footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}

function ActivationFunnelCard({
  denominator,
  stages,
  memberSampleComplete,
  detailHref,
}: {
  /** ファネル baseline (= 100% 段)。通常は totalMembers。各ステージの通過率は
   * count / denominator で計算する。「加入」段は冗長なので bar 上に出さず、
   * header band の "385 名" 表示で暗黙の分母として扱う。 */
  denominator: number;
  /** 送付 → 継続 → 定着 の順に渡す (3 ステージ前提だが component 側で固定はしない)。
   * `sampleDependent: true` のステージは memberSampleComplete=false のとき bar を
   * 空にする (memberList の limit による biased 集計が起きうるため)。 */
  stages: ReadonlyArray<{
    label: string;
    count: number;
    sampleDependent?: boolean;
  }>;
  memberSampleComplete: boolean;
  detailHref?: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-5">
      <header className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-sm font-medium text-foreground">ファネル</span>
        <MetricInfoButton metricKey="funnelOverview" />
        {!memberSampleComplete && (
          <span className="ml-auto">サンプル不足</span>
        )}
        {detailHref && (
          <Link
            href={detailHref}
            className={cn(
              "inline-flex items-center gap-0.5 hover:underline",
              memberSampleComplete && "ml-auto",
            )}
          >
            詳細を見る
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </header>
      <div className="flex flex-col gap-1.5">
        {stages.map((s) => {
          // server-aggregate な stage は常に描画。memberList sampling 依存の
          // stage (継続ユーザー) は sample 不足時に bar を空にする (誤解防止)。
          const skipBar = !memberSampleComplete && s.sampleDependent === true;
          const ratio = denominator > 0 && !skipBar ? s.count / denominator : 0;
          const ratioLabel = !skipBar && denominator > 0 ? toPct(ratio) : "-";
          return (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs text-muted-foreground">
                {s.label}
              </span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-current text-orange-600"
                  style={{ width: `${Math.min(1, ratio) * 100}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {ratioLabel}
                {!skipBar && (
                  <span className="ml-1 opacity-70">({toIntJa(s.count)})</span>
                )}
              </span>
            </div>
          );
        })}
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
