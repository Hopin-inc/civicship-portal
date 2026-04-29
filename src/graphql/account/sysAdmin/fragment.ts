import { gql } from "@apollo/client";

export const ANALYTICS_SEGMENT_COUNTS_FRAGMENT = gql`
  fragment AnalyticsSegmentCountsFields on AnalyticsSegmentCounts {
    total
    activeCount
    passiveCount
    tier1Count
    tier2Count
  }
`;

export const ANALYTICS_WINDOW_ACTIVITY_FRAGMENT = gql`
  fragment AnalyticsWindowActivityFields on AnalyticsWindowActivity {
    senderCount
    senderCountPrev
    newMemberCount
    newMemberCountPrev
    retainedSenders
  }
`;

export const ANALYTICS_WEEKLY_RETENTION_FRAGMENT = gql`
  fragment AnalyticsWeeklyRetentionFields on AnalyticsWeeklyRetention {
    retainedSenders
    churnedSenders
  }
`;

export const ANALYTICS_LATEST_COHORT_FRAGMENT = gql`
  fragment AnalyticsLatestCohortFields on AnalyticsLatestCohort {
    size
    activeAtM1
  }
`;

export const ANALYTICS_PLATFORM_SUMMARY_FRAGMENT = gql`
  fragment AnalyticsPlatformSummaryFields on AnalyticsPlatformSummary {
    communitiesCount
    latestMonthDonationPoints
    totalMembers
  }
`;

export const ANALYTICS_TENURE_DISTRIBUTION_FRAGMENT = gql`
  fragment AnalyticsTenureDistributionFields on AnalyticsTenureDistribution {
    lt1Month
    m1to3Months
    m3to12Months
    gte12Months
    monthlyHistogram {
      monthsIn
      count
    }
  }
`;

export const ANALYTICS_COMMUNITY_OVERVIEW_ROW_FRAGMENT = gql`
  fragment AnalyticsCommunityOverviewRowFields on AnalyticsCommunityOverview {
    communityId
    communityName
    totalMembers
    hubMemberCount
    dormantCount
    segmentCounts {
      ...AnalyticsSegmentCountsFields
    }
    tenureDistribution {
      ...AnalyticsTenureDistributionFields
    }
    windowActivity {
      ...AnalyticsWindowActivityFields
    }
    weeklyRetention {
      ...AnalyticsWeeklyRetentionFields
    }
    latestCohort {
      ...AnalyticsLatestCohortFields
    }
  }
  ${ANALYTICS_SEGMENT_COUNTS_FRAGMENT}
  ${ANALYTICS_TENURE_DISTRIBUTION_FRAGMENT}
  ${ANALYTICS_WINDOW_ACTIVITY_FRAGMENT}
  ${ANALYTICS_WEEKLY_RETENTION_FRAGMENT}
  ${ANALYTICS_LATEST_COHORT_FRAGMENT}
`;

// L2 (community detail) fragments. AnalyticsCommunityPayload still
// exposes an `alerts` group with the same {activeDrop, churnSpike,
// noNewMembers} shape as the legacy L1 alert. L1 derives these client-side
// now; L2 keeps the server-pre-computed signals as-is.
export const ANALYTICS_ALERT_FRAGMENT = gql`
  fragment AnalyticsAlertFields on AnalyticsCommunityAlerts {
    activeDrop
    churnSpike
    noNewMembers
  }
`;

export const ANALYTICS_COMMUNITY_DETAIL_SUMMARY_FRAGMENT = gql`
  fragment AnalyticsCommunityDetailSummaryFields on AnalyticsCommunitySummaryCard {
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

export const ANALYTICS_STAGE_BUCKET_FRAGMENT = gql`
  fragment AnalyticsStageBucketFields on AnalyticsStageBucket {
    count
    pct
    avgSendRate
    avgMonthsIn
    pointsContributionPct
  }
`;

export const ANALYTICS_STAGE_DISTRIBUTION_FRAGMENT = gql`
  fragment AnalyticsStageDistributionFields on AnalyticsStageDistribution {
    habitual {
      ...AnalyticsStageBucketFields
    }
    regular {
      ...AnalyticsStageBucketFields
    }
    occasional {
      ...AnalyticsStageBucketFields
    }
    latent {
      ...AnalyticsStageBucketFields
    }
  }
  ${ANALYTICS_STAGE_BUCKET_FRAGMENT}
`;

export const ANALYTICS_MONTHLY_ACTIVITY_POINT_FRAGMENT = gql`
  fragment AnalyticsMonthlyActivityPointFields on AnalyticsMonthlyActivityPoint {
    month
    communityActivityRate
    senderCount
    newMembers
    donationPointsSum
    chainPct
    dormantCount
    returnedMembers
    hubMemberCount
  }
`;

export const ANALYTICS_RETENTION_TREND_POINT_FRAGMENT = gql`
  fragment AnalyticsRetentionTrendPointFields on AnalyticsRetentionTrendPoint {
    week
    communityActivityRate
    retainedSenders
    churnedSenders
    returnedSenders
    newMembers
  }
`;

export const ANALYTICS_COHORT_RETENTION_POINT_FRAGMENT = gql`
  fragment AnalyticsCohortRetentionPointFields on AnalyticsCohortRetentionPoint {
    cohortMonth
    cohortSize
    retentionM1
    retentionM3
    retentionM6
  }
`;

export const ANALYTICS_COHORT_FUNNEL_POINT_FRAGMENT = gql`
  fragment AnalyticsCohortFunnelPointFields on AnalyticsCohortFunnelPoint {
    cohortMonth
    acquired
    activatedD30
    repeated
    habitual
  }
`;

export const ANALYTICS_MEMBER_ROW_FRAGMENT = gql`
  fragment AnalyticsMemberRowFields on AnalyticsMemberRow {
    userId
    name
    userSendRate
    totalPointsOut
    donationOutMonths
    monthsIn
    daysIn
    donationOutDays
    uniqueDonationRecipients
    totalPointsIn
    donationInMonths
    donationInDays
    uniqueDonationSenders
  }
`;
