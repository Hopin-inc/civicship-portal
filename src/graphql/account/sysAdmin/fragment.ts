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
