import type {
  GqlGetSysAdminCommunityDetailQuery,
  GqlGetSysAdminDashboardQuery,
  GqlSysAdminCohortRetentionPoint,
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunityDetailPayload,
  GqlSysAdminCommunityOverview,
  GqlSysAdminCommunitySummaryCard,
  GqlSysAdminMemberList,
  GqlSysAdminMemberRow,
  GqlSysAdminMonthlyActivityPoint,
  GqlSysAdminPlatformSummary,
  GqlSysAdminRetentionTrendPoint,
  GqlSysAdminSegmentCounts,
  GqlSysAdminStageBucket,
  GqlSysAdminStageDistribution,
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

export const makeSummaryCard = (
  overrides: Partial<GqlSysAdminCommunitySummaryCard> = {},
): GqlSysAdminCommunitySummaryCard => ({
  __typename: "SysAdminCommunitySummaryCard",
  communityId: "community-a",
  communityName: "コミュニティA",
  communityActivityRate: 0.42,
  communityActivityRate3mAvg: 0.39,
  growthRateActivity: 0.08,
  totalMembers: 120,
  tier2Count: 70,
  tier2Pct: 0.58,
  totalDonationPointsAllTime: 12450000,
  maxChainDepthAllTime: 4,
  dataFrom: new Date("2024-04-01T00:00:00+09:00"),
  dataTo: new Date("2026-04-01T00:00:00+09:00"),
  ...overrides,
});

export const makeStageBucket = (
  overrides: Partial<GqlSysAdminStageBucket> = {},
): GqlSysAdminStageBucket => ({
  __typename: "SysAdminStageBucket",
  count: 20,
  pct: 0.2,
  avgSendRate: 0.5,
  avgMonthsIn: 8,
  pointsContributionPct: 0.2,
  ...overrides,
});

export const makeStageDistribution = (
  overrides: Partial<GqlSysAdminStageDistribution> = {},
): GqlSysAdminStageDistribution => ({
  __typename: "SysAdminStageDistribution",
  habitual: makeStageBucket({ count: 30, pct: 0.25, avgSendRate: 0.85, pointsContributionPct: 0.55 }),
  regular: makeStageBucket({ count: 40, pct: 0.33, avgSendRate: 0.55, pointsContributionPct: 0.3 }),
  occasional: makeStageBucket({ count: 25, pct: 0.21, avgSendRate: 0.2, pointsContributionPct: 0.15 }),
  latent: makeStageBucket({ count: 25, pct: 0.21, avgSendRate: 0, pointsContributionPct: 0 }),
  ...overrides,
});

export const makeMonthlyActivityPoint = (
  overrides: Partial<GqlSysAdminMonthlyActivityPoint> = {},
): GqlSysAdminMonthlyActivityPoint => ({
  __typename: "SysAdminMonthlyActivityPoint",
  month: new Date("2026-04-01T00:00:00+09:00"),
  communityActivityRate: 0.42,
  senderCount: 50,
  newMembers: 8,
  donationPointsSum: 125000,
  chainPct: 0.12,
  ...overrides,
});

export const makeRetentionTrendPoint = (
  overrides: Partial<GqlSysAdminRetentionTrendPoint> = {},
): GqlSysAdminRetentionTrendPoint => ({
  __typename: "SysAdminRetentionTrendPoint",
  week: new Date("2026-04-13T00:00:00+09:00"),
  communityActivityRate: 0.34,
  retainedSenders: 30,
  churnedSenders: 6,
  returnedSenders: 4,
  newMembers: 3,
  ...overrides,
});

export const makeCohortRetentionPoint = (
  overrides: Partial<GqlSysAdminCohortRetentionPoint> = {},
): GqlSysAdminCohortRetentionPoint => ({
  __typename: "SysAdminCohortRetentionPoint",
  cohortMonth: new Date("2025-10-01T00:00:00+09:00"),
  cohortSize: 18,
  retentionM1: 0.67,
  retentionM3: 0.56,
  retentionM6: 0.44,
  ...overrides,
});

export const makeMemberRow = (
  overrides: Partial<GqlSysAdminMemberRow> = {},
): GqlSysAdminMemberRow => ({
  __typename: "SysAdminMemberRow",
  userId: "user-1",
  name: "山田 太郎",
  userSendRate: 0.83,
  totalPointsOut: 12500,
  donationOutMonths: 10,
  monthsIn: 12,
  ...overrides,
});

export const makeMemberList = (
  rows: GqlSysAdminMemberRow[],
  overrides: Partial<Omit<GqlSysAdminMemberList, "users">> = {},
): GqlSysAdminMemberList => ({
  __typename: "SysAdminMemberList",
  hasNextPage: false,
  nextCursor: null,
  users: rows,
  ...overrides,
});

type CommunityDetailOverrides = {
  payload?: Partial<GqlSysAdminCommunityDetailPayload>;
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

export const makeCommunityDetailPayload = (
  overrides: CommunityDetailOverrides = {},
): GqlGetSysAdminCommunityDetailQuery => {
  const baseMembers = [
    makeMemberRow({ userId: "u1", name: "山田 太郎", userSendRate: 0.91 }),
    makeMemberRow({ userId: "u2", name: "佐藤 花子", userSendRate: 0.78 }),
    makeMemberRow({ userId: "u3", name: "鈴木 一郎", userSendRate: 0.72 }),
  ];

  return {
    __typename: "Query",
    sysAdminCommunityDetail: {
      __typename: "SysAdminCommunityDetailPayload",
      asOf: new Date("2026-04-22T00:00:00+09:00"),
      communityId: "community-a",
      communityName: "コミュニティA",
      windowMonths: 10,
      alerts: makeAlerts(),
      summary: makeSummaryCard(),
      stages: makeStageDistribution(),
      monthlyActivityTrend: [
        makeMonthlyActivityPoint({ month: new Date("2025-11-01T00:00:00+09:00"), senderCount: 40, newMembers: 5 }),
        makeMonthlyActivityPoint({ month: new Date("2025-12-01T00:00:00+09:00"), senderCount: 45, newMembers: 6 }),
        makeMonthlyActivityPoint({ month: new Date("2026-01-01T00:00:00+09:00"), senderCount: 48, newMembers: 8 }),
        makeMonthlyActivityPoint({ month: new Date("2026-02-01T00:00:00+09:00"), senderCount: 52, newMembers: 9 }),
        makeMonthlyActivityPoint({ month: new Date("2026-03-01T00:00:00+09:00"), senderCount: 50, newMembers: 7 }),
        makeMonthlyActivityPoint({ month: new Date("2026-04-01T00:00:00+09:00"), senderCount: 55, newMembers: 10 }),
      ],
      retentionTrend: [
        makeRetentionTrendPoint({ week: new Date("2026-03-16T00:00:00+09:00") }),
        makeRetentionTrendPoint({ week: new Date("2026-03-23T00:00:00+09:00") }),
        makeRetentionTrendPoint({ week: new Date("2026-03-30T00:00:00+09:00") }),
        makeRetentionTrendPoint({ week: new Date("2026-04-06T00:00:00+09:00") }),
        makeRetentionTrendPoint({ week: new Date("2026-04-13T00:00:00+09:00") }),
      ],
      cohortRetention: [
        makeCohortRetentionPoint({ cohortMonth: new Date("2025-10-01T00:00:00+09:00") }),
        makeCohortRetentionPoint({
          cohortMonth: new Date("2025-11-01T00:00:00+09:00"),
          cohortSize: 22,
          retentionM1: 0.73,
          retentionM3: null,
          retentionM6: null,
        }),
      ],
      memberList: makeMemberList(baseMembers),
      ...overrides.payload,
    },
  };
};
