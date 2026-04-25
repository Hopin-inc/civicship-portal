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
