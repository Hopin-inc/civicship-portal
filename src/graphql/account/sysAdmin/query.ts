import { gql } from "@apollo/client";
import {
  SYS_ADMIN_ALERT_FRAGMENT,
  SYS_ADMIN_COHORT_RETENTION_POINT_FRAGMENT,
  SYS_ADMIN_COMMUNITY_DETAIL_SUMMARY_FRAGMENT,
  SYS_ADMIN_COMMUNITY_OVERVIEW_ROW_FRAGMENT,
  SYS_ADMIN_MEMBER_ROW_FRAGMENT,
  SYS_ADMIN_MONTHLY_ACTIVITY_POINT_FRAGMENT,
  SYS_ADMIN_PLATFORM_SUMMARY_FRAGMENT,
  SYS_ADMIN_RETENTION_TREND_POINT_FRAGMENT,
  SYS_ADMIN_STAGE_DISTRIBUTION_FRAGMENT,
} from "./fragment";

export const GET_SYS_ADMIN_DASHBOARD = gql`
  query GetSysAdminDashboard($input: SysAdminDashboardInput) {
    sysAdminDashboard(input: $input) {
      asOf
      platform {
        ...SysAdminPlatformSummaryFields
      }
      communities {
        ...SysAdminCommunityOverviewRowFields
      }
    }
  }
  ${SYS_ADMIN_PLATFORM_SUMMARY_FRAGMENT}
  ${SYS_ADMIN_COMMUNITY_OVERVIEW_ROW_FRAGMENT}
`;

export const GET_SYS_ADMIN_COMMUNITY_DETAIL = gql`
  query GetSysAdminCommunityDetail($input: SysAdminCommunityDetailInput!) {
    sysAdminCommunityDetail(input: $input) {
      asOf
      communityId
      communityName
      windowMonths
      alerts {
        ...SysAdminAlertFields
      }
      summary {
        ...SysAdminCommunityDetailSummaryFields
      }
      stages {
        ...SysAdminStageDistributionFields
      }
      monthlyActivityTrend {
        ...SysAdminMonthlyActivityPointFields
      }
      retentionTrend {
        ...SysAdminRetentionTrendPointFields
      }
      cohortRetention {
        ...SysAdminCohortRetentionPointFields
      }
      memberList {
        hasNextPage
        nextCursor
        users {
          ...SysAdminMemberRowFields
        }
      }
    }
  }
  ${SYS_ADMIN_ALERT_FRAGMENT}
  ${SYS_ADMIN_COMMUNITY_DETAIL_SUMMARY_FRAGMENT}
  ${SYS_ADMIN_STAGE_DISTRIBUTION_FRAGMENT}
  ${SYS_ADMIN_MONTHLY_ACTIVITY_POINT_FRAGMENT}
  ${SYS_ADMIN_RETENTION_TREND_POINT_FRAGMENT}
  ${SYS_ADMIN_COHORT_RETENTION_POINT_FRAGMENT}
  ${SYS_ADMIN_MEMBER_ROW_FRAGMENT}
`;
