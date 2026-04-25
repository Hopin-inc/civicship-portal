import type { GqlSysAdminCommunityOverview } from "@/types/graphql";

// MoM (= rolling-window vs preceding window) drop threshold.
// growthRateActivity <= ACTIVE_DROP_THRESHOLD points the alert.
export const ACTIVE_DROP_THRESHOLD = -0.2;

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

// Hub user share: tier1 segment (userSendRate >= tier1 threshold, default 0.7).
// "Hub" frames the highest stage as the network-role layer that anchors
// the donation graph, distinct from generic "habitual" individual behavior.
export function deriveHubUserPct(row: GqlSysAdminCommunityOverview): number {
  if (row.totalMembers === 0) return 0;
  return row.segmentCounts.tier1Count / row.totalMembers;
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
