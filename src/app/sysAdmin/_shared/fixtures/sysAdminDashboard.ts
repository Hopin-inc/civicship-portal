import type {
  GqlGetSysAdminDashboardQuery,
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunityOverview,
  GqlSysAdminPlatformSummary,
  GqlSysAdminSegmentCounts,
} from "@/types/graphql";

export const makeAlerts = (
  overrides: Partial<GqlSysAdminCommunityAlerts> = {},
): GqlSysAdminCommunityAlerts => ({
  __typename: "SysAdminCommunityAlerts",
  activeDrop: false,
  churnSpike: false,
  noNewMembers: false,
  ...overrides,
});

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
  communityActivityRate: 0.42,
  growthRateActivity: 0.08,
  latestCohortRetentionM1: 0.63,
  totalMembers: 120,
  passiveCount: 25,
  tier1Count: 40,
  tier2Count: 70,
  segmentCounts: makeSegmentCounts(),
  alerts: makeAlerts(),
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
          communityActivityRate: 0.28,
          growthRateActivity: -0.14,
          alerts: makeAlerts({ activeDrop: true }),
        }),
        makeCommunityOverview({
          communityId: "community-c",
          communityName: "コミュニティC",
          communityActivityRate: 0.55,
          growthRateActivity: 0.03,
          latestCohortRetentionM1: null,
          alerts: makeAlerts({ noNewMembers: true }),
        }),
      ],
  },
});
