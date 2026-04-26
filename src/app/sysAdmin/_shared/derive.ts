import type { GqlSysAdminCommunityOverview } from "@/types/graphql";

// MoM (= rolling-window vs preceding window) drop threshold.
// growthRateActivity <= ACTIVE_DROP_THRESHOLD points the alert.
export const ACTIVE_DROP_THRESHOLD = -0.2;

// Backend `tenureDistribution` の m3to12Months / gte12Months バケット境界
// (90 日 = 3 ヶ月相当)。stage 分類の minMonthsIn と「3 ヶ月以上 在籍率」
// メトリクスで同じ閾値を使うことで、バケット表示と分類設定が一致する。
export const TENURE_THRESHOLD_DAYS = 90;

// `SysAdminCommunityDetailInput.segmentThresholds` の SSR / hook / story
// 共通デフォルト。tier1/tier2 はユーザーが UI から動かせる knob だが
// minMonthsIn は短期在籍 artifact (1 ヶ月で 1 回送って habitual 扱い)
// を運用上排除するための固定値で、UI からは変更しない。
export const DEFAULT_SEGMENT_THRESHOLDS = {
  tier1: 0.7,
  tier2: 0.4,
  minMonthsIn: 3,
} as const;

export function deriveActivityRate(row: GqlSysAdminCommunityOverview): number {
  if (row.totalMembers === 0) return 0;
  return row.windowActivity.senderCount / row.totalMembers;
}

export function deriveActivityRatePrev(
  row: GqlSysAdminCommunityOverview,
): number {
  if (row.totalMembers === 0) return 0;
  return row.windowActivity.senderCountPrev / row.totalMembers;
}

// null when there is no baseline (prev-window had zero senders or
// totalMembers is zero); the UI renders "-" in that case.
export function deriveGrowthRateActivity(
  row: GqlSysAdminCommunityOverview,
): number | null {
  if (row.totalMembers === 0) return null;
  if (row.windowActivity.senderCountPrev === 0) return null;
  const curr = deriveActivityRate(row);
  const prev = deriveActivityRatePrev(row);
  return (curr - prev) / prev;
}

export function deriveLatestCohortRetentionM1(
  row: GqlSysAdminCommunityOverview,
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
export function deriveHubUserPct(row: GqlSysAdminCommunityOverview): number {
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
  row: GqlSysAdminCommunityOverview,
): number {
  return row.windowActivity.senderCount - row.windowActivity.retainedSenders;
}

export function deriveChurnedSenders(row: GqlSysAdminCommunityOverview): number {
  return row.windowActivity.senderCountPrev - row.windowActivity.retainedSenders;
}

export type DerivedAlerts = {
  churnSpike: boolean;
  activeDrop: boolean;
  noNewMembers: boolean;
};

export function deriveAlerts(row: GqlSysAdminCommunityOverview): DerivedAlerts {
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
