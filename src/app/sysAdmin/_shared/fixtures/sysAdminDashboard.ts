import type {
  GqlGetSysAdminCommunityDetailQuery,
  GqlGetSysAdminDashboardQuery,
  GqlSysAdminCohortRetentionPoint,
  GqlSysAdminCommunityAlerts,
  GqlSysAdminCommunityDetailPayload,
  GqlSysAdminCommunityOverview,
  GqlSysAdminCommunitySummaryCard,
  GqlSysAdminLatestCohort,
  GqlSysAdminMemberList,
  GqlSysAdminMemberRow,
  GqlSysAdminMonthlyActivityPoint,
  GqlSysAdminPlatformSummary,
  GqlSysAdminRetentionTrendPoint,
  GqlSysAdminSegmentCounts,
  GqlSysAdminStageBucket,
  GqlSysAdminStageDistribution,
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
  const windowActivity = overrides.windowActivity ?? makeWindowActivity();
  // Invariant: hubMemberCount <= windowActivity.senderCount <= totalMembers.
  // Resolve the effective windowActivity first, then clamp the hub default
  // so story overrides that lower senderCount don't push Hub% above MAU%.
  const hubMemberCount =
    overrides.hubMemberCount ??
    Math.min(Math.round(totalMembers * DEFAULT_HUB_RATIO), windowActivity.senderCount);
  return {
    __typename: "SysAdminCommunityOverview",
    communityId: overrides.communityId ?? "community-a",
    communityName: overrides.communityName ?? "コミュニティA",
    totalMembers,
    hubMemberCount,
    segmentCounts: overrides.segmentCounts ?? defaultSegmentCountsFor(totalMembers),
    windowActivity,
    weeklyRetention: overrides.weeklyRetention ?? makeWeeklyRetention(),
    latestCohort: overrides.latestCohort ?? makeLatestCohort(),
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

// =============================================================================
// L2 community detail fixtures
// =============================================================================

export const makeAlerts = (
  overrides: Partial<GqlSysAdminCommunityAlerts> = {},
): GqlSysAdminCommunityAlerts => ({
  __typename: "SysAdminCommunityAlerts",
  activeDrop: false,
  churnSpike: false,
  noNewMembers: false,
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
  uniqueDonationRecipients: 4,
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
      // windowMonths must match the runtime default (3) so stories that
      // rely on the SSR-skip path don't permanently spin in loading state.
      windowMonths: 3,
      alerts: makeAlerts(),
      summary: makeSummaryCard(),
      stages: makeStageDistribution(),
      monthlyActivityTrend: [
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
