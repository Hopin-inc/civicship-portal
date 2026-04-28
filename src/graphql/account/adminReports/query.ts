import { gql } from "@apollo/client";
import {
  ADMIN_BROWSE_REPORT_FIELDS,
  ADMIN_REPORT_SUMMARY_ROW_FRAGMENT,
} from "./fragment";

export const GET_ADMIN_BROWSE_REPORTS = gql`
  query GetAdminBrowseReports(
    $communityId: ID
    $status: ReportStatus
    $variant: ReportVariant
    $publishedAfter: Datetime
    $publishedBefore: Datetime
    $cursor: String
    $first: Int
  ) {
    adminBrowseReports(
      communityId: $communityId
      status: $status
      variant: $variant
      publishedAfter: $publishedAfter
      publishedBefore: $publishedBefore
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...AdminBrowseReportFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${ADMIN_BROWSE_REPORT_FIELDS}
`;

export const GET_ADMIN_REPORT_SUMMARY = gql`
  query GetAdminReportSummary($cursor: String, $first: Int) {
    adminReportSummary(cursor: $cursor, first: $first) {
      edges {
        cursor
        node {
          ...AdminReportSummaryRowFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${ADMIN_REPORT_SUMMARY_ROW_FRAGMENT}
`;
