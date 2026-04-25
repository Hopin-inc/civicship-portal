import type {
  GqlGetSysAdminDashboardQuery,
  GqlSysAdminCommunityOverview,
  GqlSysAdminLatestCohort,
  GqlSysAdminPlatformSummary,
  GqlSysAdminSegmentCounts,
  GqlSysAdminWeeklyRetention,
  GqlSysAdminWindowActivity,
} from "@/types/graphql";

export const makeSegmentCounts = (
  overrides: Partial<GqlSysAdminSegmentCounts> = {},
): GqlSysAdminSegmentCounts => ({
  __typename: "SysAdminSegmentCounts",
  total: 120,
  activeCount: 95,
  passiveCount: 25,
  tier1Count: 40,
  tier2Count: 70,
  ...overrides,
});

export const makeWindowActivity = (
  overrides: Partial<GqlSysAdminWindowActivity> = {},
): GqlSysAdminWindowActivity => {
  const senderCount = overrides.senderCount ?? 50;
  const senderCountPrev = overrides.senderCountPrev ?? 46;
  const newMemberCount = overrides.newMemberCount ?? 8;
  const newMemberCountPrev = overrides.newMemberCountPrev ?? 6;
  // retained ≤ min(senderCount, senderCountPrev) by definition.
  // Clamp the default so story overrides that lower senderCount(/Prev)
  // don't produce negative newlyActivated / churned counts.
  const retainedSenders =
    overrides.retainedSenders ?? Math.min(senderCount, senderCountPrev, 38);
  return {
    __typename: "SysAdminWindowActivity",
    senderCount,
    senderCountPrev,
    newMemberCount,
    newMemberCountPrev,
    retainedSenders,
  };
};

export const makeWeeklyRetention = (
  overrides: Partial<GqlSysAdminWeeklyRetention> = {},
): GqlSysAdminWeeklyRetention => ({
  __typename: "SysAdminWeeklyRetention",
  retainedSenders: 18,
  churnedSenders: 4,
  ...overrides,
});

export const makeLatestCohort = (
  overrides: Partial<GqlSysAdminLatestCohort> = {},
): GqlSysAdminLatestCohort => ({
  __typename: "SysAdminLatestCohort",
  size: 12,
  activeAtM1: 8,
  ...overrides,
});

export const makePlatformSummary = (
  overrides: Partial<GqlSysAdminPlatformSummary> = {},
): GqlSysAdminPlatformSummary => ({
  __typename: "SysAdminPlatformSummary",
  communitiesCount: 12,
  latestMonthDonationPoints: 1250000,
  totalMembers: 3200,
  ...overrides,
});

// Default proportions used to derive segmentCounts from totalMembers when
// the caller doesn't pass an explicit segmentCounts override. Keeps Hub /
// passive rates visually plausible across stories with varied totalMembers.
const DEFAULT_TIER1_RATIO = 0.33;
const DEFAULT_TIER2_RATIO = 0.58;
const DEFAULT_PASSIVE_RATIO = 0.21;
// network-axis hub ratio (independent of node-axis tier1).
const DEFAULT_HUB_RATIO = 0.18;

function defaultSegmentCountsFor(total: number): GqlSysAdminSegmentCounts {
  return {
    __typename: "SysAdminSegmentCounts",
    total,
    activeCount: Math.round(total * (1 - DEFAULT_PASSIVE_RATIO)),
    passiveCount: Math.round(total * DEFAULT_PASSIVE_RATIO),
    tier1Count: Math.round(total * DEFAULT_TIER1_RATIO),
    tier2Count: Math.round(total * DEFAULT_TIER2_RATIO),
  };
}

export const makeCommunityOverview = (
  overrides: Partial<GqlSysAdminCommunityOverview> = {},
): GqlSysAdminCommunityOverview => {
  const totalMembers = overrides.totalMembers ?? 120;
  return {
    __typename: "SysAdminCommunityOverview",
    communityId: "community-a",
    communityName: "コミュニティA",
    totalMembers,
    hubMemberCount: Math.round(totalMembers * DEFAULT_HUB_RATIO),
    segmentCounts: defaultSegmentCountsFor(totalMembers),
    windowActivity: makeWindowActivity(),
    weeklyRetention: makeWeeklyRetention(),
    latestCohort: makeLatestCohort(),
    ...overrides,
  };
};

export const makeDashboardPayload = (
  overrides: {
    platform?: Partial<GqlSysAdminPlatformSummary>;
    communities?: GqlSysAdminCommunityOverview[];
    asOf?: Date;
  } = {},
): GqlGetSysAdminDashboardQuery => ({
  __typename: "Query",
  sysAdminDashboard: {
    __typename: "SysAdminDashboardPayload",
    asOf: overrides.asOf ?? new Date("2026-04-22T00:00:00+09:00"),
    platform: makePlatformSummary(overrides.platform),
    communities:
      overrides.communities ??
      [
        makeCommunityOverview({ communityId: "community-a", communityName: "コミュニティA" }),
        makeCommunityOverview({
          communityId: "community-b",
          communityName: "コミュニティB",
          windowActivity: makeWindowActivity({ senderCount: 28, senderCountPrev: 40 }),
        }),
        makeCommunityOverview({
          communityId: "community-c",
          communityName: "コミュニティC",
          windowActivity: makeWindowActivity({ newMemberCount: 0, newMemberCountPrev: 5 }),
          latestCohort: makeLatestCohort({ size: 0, activeAtM1: 0 }),
        }),
      ],
  },
});
