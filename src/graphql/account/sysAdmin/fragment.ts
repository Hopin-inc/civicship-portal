import { gql } from "@apollo/client";

export const SYS_ADMIN_ALERT_FRAGMENT = gql`
  fragment SysAdminAlertFields on SysAdminCommunityAlerts {
    activeDrop
    churnSpike
    noNewMembers
  }
`;

export const SYS_ADMIN_SEGMENT_COUNTS_FRAGMENT = gql`
  fragment SysAdminSegmentCountsFields on SysAdminSegmentCounts {
    total
    activeCount
    passiveCount
    tier1Count
    tier2Count
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
    communityActivityRate
    growthRateActivity
    latestCohortRetentionM1
    totalMembers
    passiveCount
    tier1Count
    tier2Count
    segmentCounts {
      ...SysAdminSegmentCountsFields
    }
    alerts {
      ...SysAdminAlertFields
    }
  }
  ${SYS_ADMIN_SEGMENT_COUNTS_FRAGMENT}
  ${SYS_ADMIN_ALERT_FRAGMENT}
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
  }
`;
