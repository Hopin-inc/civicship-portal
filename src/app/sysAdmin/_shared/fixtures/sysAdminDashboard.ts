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
): GqlSysAdminWindowActivity => ({
  __typename: "SysAdminWindowActivity",
  senderCount: 50,
  senderCountPrev: 46,
  newMemberCount: 8,
  newMemberCountPrev: 6,
  ...overrides,
});

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

export const makeCommunityOverview = (
  overrides: Partial<GqlSysAdminCommunityOverview> = {},
): GqlSysAdminCommunityOverview => ({
  __typename: "SysAdminCommunityOverview",
  communityId: "community-a",
  communityName: "コミュニティA",
  totalMembers: 120,
  segmentCounts: makeSegmentCounts(),
  windowActivity: makeWindowActivity(),
  weeklyRetention: makeWeeklyRetention(),
  latestCohort: makeLatestCohort(),
  ...overrides,
});

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
