import { gql } from "@apollo/client";

/**
 * `ReportFeedback` の基本 fragment。
 * レポート detail / フィードバック投稿後の payload など、
 * Report との関連を辿らない文脈で使う。
 */
export const REPORT_FEEDBACK_FIELDS = gql`
  fragment ReportFeedbackFields on ReportFeedback {
    id
    rating
    comment
    feedbackType
    sectionKey
    createdAt
    user {
      id
      name
    }
  }
`;

/**
 * テンプレ詳細の feedback feed 用拡張版。
 * 各 feedback の card から Report detail に飛ぶための link 情報
 * (community / variant / 期間) を含む。
 *
 * `ReportFeedback.report` field は backend Phase 1.5 で追加済み。
 */
export const REPORT_FEEDBACK_WITH_REPORT_FIELDS = gql`
  fragment ReportFeedbackWithReportFields on ReportFeedback {
    ...ReportFeedbackFields
    report {
      id
      variant
      periodFrom
      periodTo
      community {
        id
        name
      }
    }
  }
  ${REPORT_FEEDBACK_FIELDS}
`;
