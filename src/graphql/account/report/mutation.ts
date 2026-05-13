import { gql } from "@apollo/client";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page から admin が代行で投稿する feedback。
 * 認可は `IsCommunityMember OR IsAdmin` で、`IsAdmin` は
 * `User.sysRole === SYS_ADMIN` で bypass される。対象 community は
 * `X-Community-Id` ヘッダから解決され、`report.communityId` と一致しないと
 * usecase が NotFoundError を返す。
 *
 * sysAdmin が他 community の report に投稿する場合、Apollo client が送る
 * ヘッダ (URL の community) では対象と一致しないので、server action
 * `submitReportFeedbackAction` 経由でヘッダに対象 report の community を
 * 当てて送る。この gql テンプレートは generated types / server action の
 * `print` のソースとして残してある。
 */
export const SUBMIT_REPORT_FEEDBACK = gql`
  mutation SubmitReportFeedback($input: SubmitReportFeedbackInput!) {
    submitReportFeedback(input: $input) {
      ... on SubmitReportFeedbackSuccess {
        feedback {
          ...ReportFeedbackFields
        }
      }
    }
  }
  ${REPORT_FEEDBACK_FIELDS}
`;
