import { gql } from "@apollo/client";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page から admin が代行で投稿する feedback。
 * permission は `CheckCommunityPermissionInput` (community owner 必須)、
 * sysAdmin は全 community のオーナーなので任意の community のレポートに
 * 投稿可能。
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

/**
 * Report のステータス遷移 mutations。
 *
 * `approveReport` / `publishReport` / `rejectReport` は schema 側に
 * 既に存在し、permission 引数は無し (= backend 側で community owner
 * 判定)。`publishReport` のみ最終的な markdown を `finalContent` で
 * 受け取る。
 *
 * 戻り値で更新後の `status` / `publishedAt` / `finalContent` を取って
 * Apollo cache を最新化するが、Container 側ではさらに `router.refresh()`
 * を呼んで SSR 経路を再走させ整合させる方針。
 */
export const APPROVE_REPORT = gql`
  mutation ApproveReport($id: ID!) {
    approveReport(id: $id) {
      ... on ApproveReportSuccess {
        report {
          id
          status
        }
      }
    }
  }
`;

export const PUBLISH_REPORT = gql`
  mutation PublishReport($id: ID!, $finalContent: String!) {
    publishReport(id: $id, finalContent: $finalContent) {
      ... on PublishReportSuccess {
        report {
          id
          status
          finalContent
          publishedAt
        }
      }
    }
  }
`;

export const REJECT_REPORT = gql`
  mutation RejectReport($id: ID!) {
    rejectReport(id: $id) {
      ... on RejectReportSuccess {
        report {
          id
          status
        }
      }
    }
  }
`;
