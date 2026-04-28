import { gql } from "@apollo/client";
import { ADMIN_REPORT_DETAIL_FIELDS } from "./fragment";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page 用に Report 単票を取得する query。
 * sysAdmin はすべての community のオーナー扱いなので `report(id)` で
 * 任意のコミュニティのレポートにアクセスできる。
 */
export const GET_ADMIN_REPORT = gql`
  query GetAdminReport($id: ID!) {
    report(id: $id) {
      ...AdminReportDetailFields
    }
  }
  ${ADMIN_REPORT_DETAIL_FIELDS}
`;

/**
 * Report detail page で「このレポートに付けられた feedback 一覧」を
 * cursor pagination で取得する query。
 * 投稿フォームから submit 後の cache 更新用にも使う。
 */
export const GET_ADMIN_REPORT_FEEDBACKS = gql`
  query GetAdminReportFeedbacks($id: ID!, $cursor: String, $first: Int) {
    report(id: $id) {
      id
      feedbacks(after: $cursor, first: $first) {
        edges {
          cursor
          node {
            ...ReportFeedbackFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
  ${REPORT_FEEDBACK_FIELDS}
`;
