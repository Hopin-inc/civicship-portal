import { gql } from "@apollo/client";
import {
  ADMIN_BROWSE_REPORT_FIELDS,
  ADMIN_REPORT_SUMMARY_ROW_FRAGMENT,
} from "./fragment";

export const GET_REPORTS_ALL = gql`
  query GetReportsAll(
    $communityId: ID
    $status: ReportStatus
    $variant: ReportVariant
    $publishedAfter: Datetime
    $publishedBefore: Datetime
    $cursor: String
    $first: Int
  ) {
    reportsAll(
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

export const GET_REPORT_SUMMARIES = gql`
  query GetReportSummaries($cursor: String, $first: Int) {
    reportSummaries(cursor: $cursor, first: $first) {
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
