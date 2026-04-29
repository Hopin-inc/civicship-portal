import { gql } from "@apollo/client";
import {
  ANALYTICS_ALERT_FRAGMENT,
  ANALYTICS_COHORT_FUNNEL_POINT_FRAGMENT,
  ANALYTICS_COHORT_RETENTION_POINT_FRAGMENT,
  ANALYTICS_COMMUNITY_DETAIL_SUMMARY_FRAGMENT,
  ANALYTICS_COMMUNITY_OVERVIEW_ROW_FRAGMENT,
  ANALYTICS_MEMBER_ROW_FRAGMENT,
  ANALYTICS_MONTHLY_ACTIVITY_POINT_FRAGMENT,
  ANALYTICS_PLATFORM_SUMMARY_FRAGMENT,
  ANALYTICS_RETENTION_TREND_POINT_FRAGMENT,
  ANALYTICS_STAGE_DISTRIBUTION_FRAGMENT,
} from "./fragment";

export const GET_ANALYTICS_DASHBOARD = gql`
  query GetAnalyticsDashboard($input: AnalyticsDashboardInput) {
    analyticsDashboard(input: $input) {
      asOf
      platform {
        ...AnalyticsPlatformSummaryFields
      }
      communities {
        ...AnalyticsCommunityOverviewRowFields
      }
    }
  }
  ${ANALYTICS_PLATFORM_SUMMARY_FRAGMENT}
  ${ANALYTICS_COMMUNITY_OVERVIEW_ROW_FRAGMENT}
`;

export const GET_ANALYTICS_COMMUNITY = gql`
  query GetAnalyticsCommunity($input: AnalyticsCommunityInput!) {
    analyticsCommunity(input: $input) {
      asOf
      communityId
      communityName
      windowMonths
      dormantCount
      alerts {
        ...AnalyticsAlertFields
      }
      summary {
        ...AnalyticsCommunityDetailSummaryFields
      }
      stages {
        ...AnalyticsStageDistributionFields
      }
      monthlyActivityTrend {
        ...AnalyticsMonthlyActivityPointFields
      }
      retentionTrend {
        ...AnalyticsRetentionTrendPointFields
      }
      cohortRetention {
        ...AnalyticsCohortRetentionPointFields
      }
      cohortFunnel {
        ...AnalyticsCohortFunnelPointFields
      }
      memberList {
        hasNextPage
        nextCursor
        users {
          ...AnalyticsMemberRowFields
        }
      }
    }
  }
  ${ANALYTICS_ALERT_FRAGMENT}
  ${ANALYTICS_COMMUNITY_DETAIL_SUMMARY_FRAGMENT}
  ${ANALYTICS_STAGE_DISTRIBUTION_FRAGMENT}
  ${ANALYTICS_MONTHLY_ACTIVITY_POINT_FRAGMENT}
  ${ANALYTICS_RETENTION_TREND_POINT_FRAGMENT}
  ${ANALYTICS_COHORT_RETENTION_POINT_FRAGMENT}
  ${ANALYTICS_COHORT_FUNNEL_POINT_FRAGMENT}
  ${ANALYTICS_MEMBER_ROW_FRAGMENT}
`;
