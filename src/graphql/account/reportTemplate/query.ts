import { gql } from "@apollo/client";
import {
  REPORT_TEMPLATE_FRAGMENT,
  REPORT_TEMPLATE_STATS_BREAKDOWN_ROW_FRAGMENT,
  REPORT_TEMPLATE_STATS_FRAGMENT,
} from "./fragment";

export const GET_REPORT_TEMPLATE = gql`
  query GetReportTemplate($variant: ReportVariant!, $communityId: ID) {
    reportTemplate(variant: $variant, communityId: $communityId) {
      ...ReportTemplateFields
    }
  }
  ${REPORT_TEMPLATE_FRAGMENT}
`;

export const GET_REPORT_TEMPLATE_STATS = gql`
  query GetReportTemplateStats($variant: ReportVariant!, $version: Int) {
    reportTemplateStats(variant: $variant, version: $version) {
      ...ReportTemplateStatsFields
    }
  }
  ${REPORT_TEMPLATE_STATS_FRAGMENT}
`;

export const GET_REPORT_TEMPLATES = gql`
  query GetReportTemplates(
    $variant: ReportVariant!
    $communityId: ID
    $kind: ReportTemplateKind
    $includeInactive: Boolean
  ) {
    reportTemplates(
      variant: $variant
      communityId: $communityId
      kind: $kind
      includeInactive: $includeInactive
    ) {
      ...ReportTemplateFields
    }
  }
  ${REPORT_TEMPLATE_FRAGMENT}
`;

export const GET_REPORT_TEMPLATE_STATS_BREAKDOWN = gql`
  query GetReportTemplateStatsBreakdown(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
    $includeInactive: Boolean
    $cursor: String
    $first: Int
  ) {
    reportTemplateStatsBreakdown(
      variant: $variant
      version: $version
      kind: $kind
      includeInactive: $includeInactive
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...ReportTemplateStatsBreakdownRowFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${REPORT_TEMPLATE_STATS_BREAKDOWN_ROW_FRAGMENT}
`;

