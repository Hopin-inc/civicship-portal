import { gql } from "@apollo/client";
import {
  REPORT_FEEDBACK_FIELDS,
  REPORT_FEEDBACK_WITH_REPORT_FIELDS,
} from "../reportFeedback/fragment";

/**
 * テンプレ詳細の feedback feed 用 query。
 * variant + version + kind で絞り込み、各 feedback には `report` を含めて
 * card から元のレポートへ飛べるようにする。
 */
export const GET_ADMIN_TEMPLATE_FEEDBACKS = gql`
  query GetAdminTemplateFeedbacks(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
    $feedbackType: ReportFeedbackType
    $maxRating: Int
    $cursor: String
    $first: Int
  ) {
    adminTemplateFeedbacks(
      variant: $variant
      version: $version
      kind: $kind
      feedbackType: $feedbackType
      maxRating: $maxRating
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...ReportFeedbackWithReportFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${REPORT_FEEDBACK_WITH_REPORT_FIELDS}
  ${REPORT_FEEDBACK_FIELDS}
`;

/**
 * テンプレ詳細の summary (avgRating / 件数 / rating 分布) 用 query。
 *
 * `adminTemplateFeedbacks` (list) と引数を揃えてあるので、frontend 側で
 * 1 つの filter object から両方に流せる。`feedbackType` / `maxRating` は
 * stats 側にはあえて含めない (= 母集団の分布を出す)。
 */
export const GET_ADMIN_TEMPLATE_FEEDBACK_STATS = gql`
  query GetAdminTemplateFeedbackStats(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
  ) {
    adminTemplateFeedbackStats(
      variant: $variant
      version: $version
      kind: $kind
    ) {
      totalCount
      avgRating
      ratingDistribution {
        rating
        count
      }
    }
  }
`;
