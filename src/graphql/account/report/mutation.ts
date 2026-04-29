import { gql } from "@apollo/client";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page から admin が代行で投稿する feedback。
 * permission は `CheckCommunityPermissionInput` (community owner 必須)、
 * sysAdmin は全 community のオーナーなので任意の community のレポートに
 * 投稿可能。ただし backend の auth テナントは `X-Community-Id` ヘッダー /
 * `__session_{communityId}` cookie で決まるので、URL 側で
 * `/sysAdmin/{communityId}/...` の community と一致させる必要がある
 * (middleware で URL から community を抽出して同期している)。
 */
export const SUBMIT_REPORT_FEEDBACK = gql`
  mutation SubmitReportFeedback(
    $input: SubmitReportFeedbackInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    submitReportFeedback(input: $input, permission: $permission) {
      ... on SubmitReportFeedbackSuccess {
        feedback {
          ...ReportFeedbackFields
        }
      }
    }
  }
  ${REPORT_FEEDBACK_FIELDS}
`;
