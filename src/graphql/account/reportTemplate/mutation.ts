import { gql } from "@apollo/client";
import { REPORT_TEMPLATE_FRAGMENT } from "./fragment";

export const UPDATE_REPORT_TEMPLATE = gql`
  mutation UpdateReportTemplate(
    $variant: ReportVariant!
    $input: UpdateReportTemplateInput!
    $communityId: ID
  ) {
    updateReportTemplate(
      variant: $variant
      input: $input
      communityId: $communityId
    ) {
      ... on UpdateReportTemplateSuccess {
        reportTemplate {
          ...ReportTemplateFields
        }
      }
    }
  }
  ${REPORT_TEMPLATE_FRAGMENT}
`;
