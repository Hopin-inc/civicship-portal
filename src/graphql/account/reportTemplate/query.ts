import { gql } from "@apollo/client";
import {
  REPORT_TEMPLATE_FRAGMENT,
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
