import { gql } from "@apollo/client";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page 用の詳細 fragment。
 *
 * 一覧用の `AdminBrowseReportFields` に対し、本文 + 期間 + テンプレリンク +
 * currentUser (= sysAdmin) の自分の feedback を含む。
 *
 * `myFeedback` は admin が代行投稿した最新の自分の feedback。
 * 投稿フォームの初期値や「投稿済み」表示の判定に使う。
 */
export const ADMIN_REPORT_DETAIL_FIELDS = gql`
  fragment AdminReportDetailFields on Report {
    id
    variant
    status
    publishedAt
    createdAt
    updatedAt
    periodFrom
    periodTo
    outputMarkdown
    finalContent
    skipReason
    regenerateCount
    community {
      id
      name
    }
    template {
      id
      variant
      version
      kind
      experimentKey
      trafficWeight
    }
    generatedByUser {
      id
      name
    }
    publishedByUser {
      id
      name
    }
    myFeedback {
      ...ReportFeedbackFields
    }
  }
  ${REPORT_FEEDBACK_FIELDS}
`;
