import { gql } from "@apollo/client";

export const ADMIN_REPORT_SUMMARY_ROW_FRAGMENT = gql`
  fragment AdminReportSummaryRowFields on AdminReportSummaryRow {
    community {
      id
      name
    }
    lastPublishedReport {
      id
      variant
      status
      publishedAt
    }
    lastPublishedAt
    daysSinceLastPublish
    publishedCountLast90Days
  }
`;

export const ADMIN_BROWSE_REPORT_FIELDS = gql`
  fragment AdminBrowseReportFields on Report {
    id
    variant
    status
    publishedAt
    createdAt
    community {
      id
      name
    }
  }
`;
