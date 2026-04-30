import type { GqlAnalyticsCommunityOverview } from "@/types/graphql";

// MoM (= rolling-window vs preceding window) drop threshold.
// growthRateActivity <= ACTIVE_DROP_THRESHOLD points the alert.
export const ACTIVE_DROP_THRESHOLD = -0.2;

// Backend `tenureDistribution` の m3to12Months / gte12Months バケット境界
// (90 日 = 3 ヶ月相当)。stage 分類の minMonthsIn と「3 ヶ月以上 在籍率」
// メトリクスで同じ閾値を使うことで、バケット表示と分類設定が一致する。
export const TENURE_THRESHOLD_DAYS = 90;

// `AnalyticsCommunityInput.segmentThresholds` の SSR / hook / story
// 共通デフォルト。tier1/tier2 はユーザーが UI から動かせる knob だが
// minMonthsIn は短期在籍 artifact (1 ヶ月で 1 回送って habitual 扱い)
// を運用上排除するための固定値で、UI からは変更しない。
export const DEFAULT_SEGMENT_THRESHOLDS = {
  tier1: 0.7,
  tier2: 0.4,
  minMonthsIn: 3,
} as const;

export function deriveActivityRate(row: GqlAnalyticsCommunityOverview): number {
  if (row.totalMembers === 0) return 0;
  return row.windowActivity.senderCount / row.totalMembers;
}

export function deriveActivityRatePrev(
  row: GqlAnalyticsCommunityOverview,
): number {
  if (row.totalMembers === 0) return 0;
  return row.windowActivity.senderCountPrev / row.totalMembers;
}

// null when there is no baseline (prev-window had zero senders or
// totalMembers is zero); the UI renders "-" in that case.
export function deriveGrowthRateActivity(
  row: GqlAnalyticsCommunityOverview,
): number | null {
  if (row.totalMembers === 0) return null;
  if (row.windowActivity.senderCountPrev === 0) return null;
  const curr = deriveActivityRate(row);
  const prev = deriveActivityRatePrev(row);
  return (curr - prev) / prev;
}

export function deriveLatestCohortRetentionM1(
  row: GqlAnalyticsCommunityOverview,
): number | null {
  if (row.latestCohort.size === 0) return null;
  return row.latestCohort.activeAtM1 / row.latestCohort.size;
}

// Hub user share — pure network-axis metric.
// Hub member = sent DONATION to >= hubBreadthThreshold (default 3) distinct
// recipients within the parametric window. Independent of userSendRate
// (the node-axis tier1/2/passive segments live in segmentCounts).
//
//   ratio = hubMemberCount / totalMembers
//
// "Hub" labels the relational-breadth layer of the donation graph; the
// node-axis "habitual / regular / occasional / latent" stage hierarchy
// is orthogonal and surfaces in L2 detail.
export function deriveHubUserPct(row: GqlAnalyticsCommunityOverview): number {
  if (row.totalMembers === 0) return 0;
  return row.hubMemberCount / row.totalMembers;
}

// 休眠化率 = dormantCount / totalMembers。dormantCount は server で計算済
// (「過去送付経験あり ∧ 直近 dormantThresholdDays 日 送付なし」)。
// stages.latent (一度も送付なし) とは別軸 — 「再活性化の余地」を表す。
export function deriveDormantRate(row: {
  totalMembers: number;
  dormantCount: number;
}): number | null {
  if (row.totalMembers === 0) return null;
  return row.dormantCount / row.totalMembers;
}

// Activity-flow leaky-bucket pair derived from windowActivity raw counts.
//   newlyActivated = senderCount     - retainedSenders   (entered active pool)
//   churned        = senderCountPrev - retainedSenders   (left active pool)
export function deriveNewlyActivatedSenders(
  row: GqlAnalyticsCommunityOverview,
): number {
  return row.windowActivity.senderCount - row.windowActivity.retainedSenders;
}

export function deriveChurnedSenders(row: GqlAnalyticsCommunityOverview): number {
  return row.windowActivity.senderCountPrev - row.windowActivity.retainedSenders;
}

export type DerivedAlerts = {
  churnSpike: boolean;
  activeDrop: boolean;
  noNewMembers: boolean;
};

export function deriveAlerts(row: GqlAnalyticsCommunityOverview): DerivedAlerts {
  const growth = deriveGrowthRateActivity(row);
  return {
    churnSpike:
      row.weeklyRetention.churnedSenders > row.weeklyRetention.retainedSenders,
    activeDrop: growth != null && growth <= ACTIVE_DROP_THRESHOLD,
    noNewMembers: row.windowActivity.newMemberCount === 0,
  };
}

export function hasAnyAlert(alerts: DerivedAlerts): boolean {
  return alerts.churnSpike || alerts.activeDrop || alerts.noNewMembers;
}

// -----------------------------------------------------------------
// Dashboard L2 metrics
//
// 入力は GraphQL 型ではなく構造的最小 shape にする。これは
//   1. mock fixtures / test 用の plain object でも呼べる
//   2. backend (civicship-api) の型と直接バインドしない
// が狙い。共有ライブラリ化する際の移植コストを最小化する。
// -----------------------------------------------------------------

/**
 * 受領→送付 転換率 (互酬到達率): 受領経験者のうち送付経験もある人の比率。
 *
 * memberList は totalPointsOut DESC で並ぶため、limit に達していると
 * 「受領のみで送付なし (totalPointsOut == 0)」のメンバーが末尾で切り捨て
 * られ、分母 (受領経験者) が過小評価されて転換率が実態より高く出る。
 * `hasNextPage === true` (= サンプル不足) の時は null を返し、UI 側で
 * 全件取得 (cursor pagination) か server-side 集計が入るまで値を出さない。
 */
export function deriveRecipientToSenderRate(
  users: ReadonlyArray<{ totalPointsIn: number; totalPointsOut: number }>,
  hasNextPage: boolean,
): number | null {
  if (hasNextPage) return null;
  const recipients = users.filter((u) => u.totalPointsIn > 0);
  if (recipients.length === 0) return null;
  const recipientSenders = recipients.filter((u) => u.totalPointsOut > 0);
  return recipientSenders.length / recipients.length;
}

/** 平均送付先数: active members の uniqueDonationRecipients 平均。 */
export function deriveAvgRecipients(
  activeMembers: ReadonlyArray<{ uniqueDonationRecipients: number }>,
): number {
  if (activeMembers.length === 0) return 0;
  const sum = activeMembers.reduce(
    (acc, u) => acc + u.uniqueDonationRecipients,
    0,
  );
  return sum / activeMembers.length;
}

/**
 * 流通量 MoM: 最新月と前月の donationPointsSum 比 (curr - prev) / prev。
 * 前月不在 / 前月分母 0 で null。
 */
export function deriveDonationMoM(
  monthlyTrend: ReadonlyArray<{ donationPointsSum: number }>,
): number | null {
  const latest = monthlyTrend[monthlyTrend.length - 1];
  const prev = monthlyTrend[monthlyTrend.length - 2];
  if (!latest || !prev || prev.donationPointsSum <= 0) return null;
  return (latest.donationPointsSum - prev.donationPointsSum) / prev.donationPointsSum;
}

// 30日 = 1ヶ月 近似。dataFrom/dataTo の差分から月数を出す簡易計算で、
// 厳密なカレンダー月差ではない (年12.17ヶ月になる程度の誤差が出る)。
const MS_PER_APPROX_MONTH = 1000 * 60 * 60 * 24 * 30;

/**
 * コミュニティ年齢 (月数 / Math.round)。
 * codegen の `Datetime` は型上 Date だが SSR / network からは ISO 文字列で
 * 来るため、必ず new Date() でラップしてから差を取る。
 */
export function deriveCommunityAgeMonths(
  dataFrom: string | Date | null | undefined,
  dataTo: string | Date | null | undefined,
): number | null {
  if (!dataFrom || !dataTo) return null;
  const fromMs = new Date(dataFrom).getTime();
  const toMs = new Date(dataTo).getTime();
  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs)) return null;
  return Math.round((toMs - fromMs) / MS_PER_APPROX_MONTH);
}

/**
 * 平均月次流通 = 累計 / コミュニティ稼働月数。
 *
 * monthlyActivityTrend.length は windowMonths (default 3) で頭打ちなので、
 * それを分母にすると長く稼働している community ほど見かけ上膨れる
 * (24 ヶ月稼働なら 8 倍)。dataFrom→dataTo から導いた ageMonths を必ず使う。
 */
export function deriveAvgMonthlyThroughput(
  totalDonationPointsAllTime: number,
  ageMonths: number | null,
): number | null {
  if (totalDonationPointsAllTime <= 0) return null;
  if (ageMonths == null || ageMonths <= 0) return null;
  return totalDonationPointsAllTime / ageMonths;
}

/**
 * 1 人あたり月次流通 = avgMonthlyThroughput / totalMembers。
 * civicship 哲学的に「コミュニティ全体の絶対額」より「メンバー 1 人あたりの
 * 月次活動量」が比較可能で意味がある、という規模補正値。
 */
export function deriveAvgMonthlyPerMember(
  avgMonthlyThroughput: number | null,
  totalMembers: number,
): number | null {
  if (avgMonthlyThroughput == null || totalMembers <= 0) return null;
  return avgMonthlyThroughput / totalMembers;
}

/**
 * 流通量集中度 (Pareto): 累計の coverage (例: 0.8) を達成するのに必要な
 * 上位ユーザー比率。降順ソート→累積和でカバレッジ到達点のインデックスを
 * 返す。`users` 空 / 累計 0 で null、誰も到達しない場合は 1。
 */
export function computeParetoTopShare(
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

/**
 * 週次送付継続率 (単一週): retainedSenders / (retainedSenders + churnedSenders)。
 * 該当週なし / 母数 0 で null。
 */
export function deriveWeeklyContinuationRate(
  week: { retainedSenders: number; churnedSenders: number } | undefined,
): number | null {
  if (!week) return null;
  const denom = week.retainedSenders + week.churnedSenders;
  if (denom <= 0) return null;
  return week.retainedSenders / denom;
}

/**
 * 週次送付継続率 シリーズ: 末尾 windowSize 週分を `deriveWeeklyContinuationRate`
 * で集計。母数 0 のセルは null (HistoryBars 側で gap 表示)。
 */
export function deriveWeeklyContinuationSeries(
  retentionTrend: ReadonlyArray<{
    retainedSenders: number;
    churnedSenders: number;
  }>,
  windowSize: number,
): Array<number | null> {
  return retentionTrend
    .slice(-windowSize)
    .map((w) => deriveWeeklyContinuationRate(w));
}

// 直近 cohort の M+1 が前期から `COHORT_M1_ALERT_THRESHOLD` 以上低下したら
// alert (onboarding 機能不全シグナル)。
export const COHORT_M1_ALERT_THRESHOLD = -0.05;

/**
 * 直近 cohort と前期 cohort の M+1 デルタ (latest - prev)。
 * どちらかが retentionM1 null で null。
 */
export function deriveCohortM1Delta(
  latest: { retentionM1?: number | null } | undefined,
  prev: { retentionM1?: number | null } | undefined,
): number | null {
  if (latest?.retentionM1 == null || prev?.retentionM1 == null) return null;
  return latest.retentionM1 - prev.retentionM1;
}

export function isCohortM1Alert(delta: number | null): boolean {
  return delta != null && delta <= COHORT_M1_ALERT_THRESHOLD;
}

// 新規定着率 (D30 相当): 直近完了 N コホートの retentionM1 平均で算出。
// 最新 cohort は m+1 が未完了で null になりがちなので、retentionM1 != null
// の cohort だけを slice の対象にする。
export const D30_COHORT_WINDOW = 3;

/**
 * D30 初回送付率: retentionM1 が埋まっている cohort のうち末尾 windowSize 個の
 * retentionM1 平均。完了 cohort 0 件で null。`cohortCount` は集計対象になった
 * cohort 数 (= UI で「直近 N コホート平均」表示に使う)。
 */
export function deriveD30ActivationRate(
  cohortRetention: ReadonlyArray<{ retentionM1?: number | null }>,
  windowSize: number = D30_COHORT_WINDOW,
): { rate: number | null; cohortCount: number } {
  const completed = cohortRetention.filter((c) => c.retentionM1 != null);
  const recent = completed.slice(-windowSize);
  if (recent.length === 0) return { rate: null, cohortCount: 0 };
  const sum = recent.reduce((acc, c) => acc + (c.retentionM1 ?? 0), 0);
  return { rate: sum / recent.length, cohortCount: recent.length };
}

/**
 * 新規率 (最新月): newMemberCount / totalMembers。
 * newMemberCount は呼び出し側で渡す calendar-month の値で、28 日 rolling 窓
 * ではない点に注意。null/undefined や totalMembers 0 で null。
 */
export function deriveNewMemberRate(
  newMemberCount: number | null | undefined,
  totalMembers: number,
): number | null {
  if (newMemberCount == null || totalMembers <= 0) return null;
  return newMemberCount / totalMembers;
}

/**
 * 復帰率 (単一月): 「先月末時点で休眠だった人のうち、今月送付した人の比率」。
 * 分子は今月点の returnedMembers、分母は前月点の dormantCount。
 * いずれか欠落、または前月 dormantCount が 0 で null。
 */
export function deriveRecoveryRate(
  latest: { returnedMembers?: number | null } | undefined,
  prev: { dormantCount: number } | undefined,
): number | null {
  if (!latest || !prev) return null;
  if (latest.returnedMembers == null) return null;
  if (prev.dormantCount <= 0) return null;
  return latest.returnedMembers / prev.dormantCount;
}

/**
 * 復帰率 月次推移: 各月 i について `deriveRecoveryRate(arr[i], arr[i-1])`。
 * 先頭は前月不在で null。
 */
export function deriveRecoverySeries(
  monthlyTrend: ReadonlyArray<{
    returnedMembers?: number | null;
    dormantCount: number;
  }>,
): Array<number | null> {
  return monthlyTrend.map((m, i, arr) => {
    if (i === 0) return null;
    return deriveRecoveryRate(m, arr[i - 1]);
  });
}

/**
 * 3 ヶ月以上 在籍率の memberList fallback。
 *
 * 本来は community 全体の `tenureDistribution` から `deriveTenuredRatio`
 * (TenureBar.tsx) で出すのが正で、これは distribution が無い場合の暫定。
 * memberList は totalPointsOut DESC top N なので donor 偏重 → 長期在籍に
 * 偏る。UI では「上位寄与者ベース (暫定)」と注記する。
 */
export function deriveTenuredRatioFromMemberList(
  users: ReadonlyArray<{ daysIn: number }>,
  thresholdDays: number = TENURE_THRESHOLD_DAYS,
): number | null {
  if (users.length === 0) return null;
  const tenured = users.filter((u) => u.daysIn >= thresholdDays).length;
  return tenured / users.length;
}

/**
 * 「定期」segment が「定着」segment を上回っているか。
 * 中堅層 (regular) が安定層 (habitual) より厚い = 定着への伸びしろがある
 * という運用シグナルとして UI で issue 表示する。
 */
export function isRegularOverHabitual(
  habitualCount: number,
  regularCount: number,
): boolean {
  return habitualCount > 0 && regularCount > habitualCount;
}

// アクティベーションファネル「継続」段の閾値 (donationOutMonths >= N で継続扱い)。
export const FUNNEL_CONTINUING_MIN_MONTHS = 2;

/**
 * 送付段の人数 = totalMembers - latentCount (= 1 回でも送付した人)。
 * 引き算が負になることはないはずだが防御的に Math.max(0, ...)。
 */
export function deriveSentCount(
  totalMembers: number,
  latentCount: number,
): number {
  return Math.max(0, totalMembers - latentCount);
}

/**
 * 継続段の人数 = donationOutMonths >= FUNNEL_CONTINUING_MIN_MONTHS のメンバー数。
 *
 * 注意: memberList は totalPointsOut DESC で limit (default 1000) され
 * るので、totalMembers > limit の community では undersampled。呼び出し側で
 * `memberSampleComplete` フラグを併せて持ち、UI で sample 不足表示する。
 */
export function countContinuingSenders(
  users: ReadonlyArray<{ donationOutMonths: number }>,
): number {
  return users.filter(
    (u) => u.donationOutMonths >= FUNNEL_CONTINUING_MIN_MONTHS,
  ).length;
}
