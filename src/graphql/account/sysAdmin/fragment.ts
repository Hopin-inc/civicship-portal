import { gql } from "@apollo/client";

export const SYS_ADMIN_SEGMENT_COUNTS_FRAGMENT = gql`
  fragment SysAdminSegmentCountsFields on SysAdminSegmentCounts {
    total
    activeCount
    passiveCount
    tier1Count
    tier2Count
  }
`;

export const SYS_ADMIN_WINDOW_ACTIVITY_FRAGMENT = gql`
  fragment SysAdminWindowActivityFields on SysAdminWindowActivity {
    senderCount
    senderCountPrev
    newMemberCount
    newMemberCountPrev
    retainedSenders
  }
`;

export const SYS_ADMIN_WEEKLY_RETENTION_FRAGMENT = gql`
  fragment SysAdminWeeklyRetentionFields on SysAdminWeeklyRetention {
    retainedSenders
    churnedSenders
  }
`;

export const SYS_ADMIN_LATEST_COHORT_FRAGMENT = gql`
  fragment SysAdminLatestCohortFields on SysAdminLatestCohort {
    size
    activeAtM1
  }
`;

export const SYS_ADMIN_PLATFORM_SUMMARY_FRAGMENT = gql`
  fragment SysAdminPlatformSummaryFields on SysAdminPlatformSummary {
    communitiesCount
    latestMonthDonationPoints
    totalMembers
  }
`;

export const SYS_ADMIN_COMMUNITY_OVERVIEW_ROW_FRAGMENT = gql`
  fragment SysAdminCommunityOverviewRowFields on SysAdminCommunityOverview {
    communityId
    communityName
    totalMembers
    hubMemberCount
    segmentCounts {
      ...SysAdminSegmentCountsFields
    }
    windowActivity {
      ...SysAdminWindowActivityFields
    }
    weeklyRetention {
      ...SysAdminWeeklyRetentionFields
    }
    latestCohort {
      ...SysAdminLatestCohortFields
    }
  }
  ${SYS_ADMIN_SEGMENT_COUNTS_FRAGMENT}
  ${SYS_ADMIN_WINDOW_ACTIVITY_FRAGMENT}
  ${SYS_ADMIN_WEEKLY_RETENTION_FRAGMENT}
  ${SYS_ADMIN_LATEST_COHORT_FRAGMENT}
`;

// L2 (community detail) fragments. SysAdminCommunityDetailPayload still
// exposes an `alerts` group with the same {activeDrop, churnSpike,
// noNewMembers} shape as the legacy L1 alert. L1 derives these client-side
// now; L2 keeps the server-pre-computed signals as-is.
export const SYS_ADMIN_ALERT_FRAGMENT = gql`
  fragment SysAdminAlertFields on SysAdminCommunityAlerts {
    activeDrop
    churnSpike
    noNewMembers
  }
`;

export const SYS_ADMIN_COMMUNITY_DETAIL_SUMMARY_FRAGMENT = gql`
  fragment SysAdminCommunityDetailSummaryFields on SysAdminCommunitySummaryCard {
    communityId
    communityName
    communityActivityRate
    communityActivityRate3mAvg
    growthRateActivity
    totalMembers
    tier2Count
    tier2Pct
    totalDonationPointsAllTime
    maxChainDepthAllTime
    dataFrom
    dataTo
  }
`;

export const SYS_ADMIN_STAGE_BUCKET_FRAGMENT = gql`
  fragment SysAdminStageBucketFields on SysAdminStageBucket {
    count
    pct
    avgSendRate
    avgMonthsIn
    pointsContributionPct
  }
`;

export const SYS_ADMIN_STAGE_DISTRIBUTION_FRAGMENT = gql`
  fragment SysAdminStageDistributionFields on SysAdminStageDistribution {
    habitual {
      ...SysAdminStageBucketFields
    }
    regular {
      ...SysAdminStageBucketFields
    }
    occasional {
      ...SysAdminStageBucketFields
    }
    latent {
      ...SysAdminStageBucketFields
    }
  }
  ${SYS_ADMIN_STAGE_BUCKET_FRAGMENT}
`;

export const SYS_ADMIN_MONTHLY_ACTIVITY_POINT_FRAGMENT = gql`
  fragment SysAdminMonthlyActivityPointFields on SysAdminMonthlyActivityPoint {
    month
    communityActivityRate
    senderCount
    newMembers
    donationPointsSum
    chainPct
  }
`;

export const SYS_ADMIN_RETENTION_TREND_POINT_FRAGMENT = gql`
  fragment SysAdminRetentionTrendPointFields on SysAdminRetentionTrendPoint {
    week
    communityActivityRate
    retainedSenders
    churnedSenders
    returnedSenders
    newMembers
  }
`;

export const SYS_ADMIN_COHORT_RETENTION_POINT_FRAGMENT = gql`
  fragment SysAdminCohortRetentionPointFields on SysAdminCohortRetentionPoint {
    cohortMonth
    cohortSize
    retentionM1
    retentionM3
    retentionM6
  }
`;

export const SYS_ADMIN_MEMBER_ROW_FRAGMENT = gql`
  fragment SysAdminMemberRowFields on SysAdminMemberRow {
    userId
    name
    userSendRate
    totalPointsOut
    donationOutMonths
    monthsIn
    uniqueDonationRecipients
  }
`;
