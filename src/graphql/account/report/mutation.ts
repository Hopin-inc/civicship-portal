import { gql } from "@apollo/client";
import { REPORT_FEEDBACK_FIELDS } from "../reportFeedback/fragment";

/**
 * Report detail page から admin が代行で投稿する feedback。
 * permission は `CheckCommunityPermissionInput` で OR チェック (`IsCommunityMember`
 * または `IsAdmin`)、`IsAdmin` は `User.sysRole = SYS_ADMIN` を見て bypass する。
 *
 * ただし backend の auth middleware (`firebase-auth.ts`) は `X-Community-Id` を
 * Firebase tenant 解決と `identities.some.{uid, communityId}` の検索キーの両方に
 * 使うので、sysAdmin の identity が住む home community と `X-Community-Id` が
 * 一致していないと `currentUser=null` になり OR の両側が落ちる。
 *
 * sysAdmin が他 community の report に投稿する場合は client mutation ではなく
 * server action `submitReportFeedbackAction` を使うこと (HttpOnly cookie から
 * home community を解決して `X-Community-Id` を組み立てる)。この `gql`
 * テンプレートは generated types / SSR 用 `print` のソースとして残してある。
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
