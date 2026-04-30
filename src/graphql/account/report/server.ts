import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetAdminReportDocument,
  GetAdminReportFeedbacksDocument,
  SubmitReportFeedbackDocument,
} from "@/types/graphql";

/**
 * Report detail page 用の SSR 用 string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 *
 * Report 単票と feedbacks Connection は分離してある。
 * 同じ document に nested で持たせると Apollo Armor の cost limit を
 * 超過するため (1 root call につき高い weight が乗る)、独立 query にして
 * SSR でも並行で叩く。
 */
export const GET_ADMIN_REPORT_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminReportDocument),
);

export const GET_ADMIN_REPORT_FEEDBACKS_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminReportFeedbacksDocument),
);

/**
 * sysAdmin の feedback 投稿は client Apollo ではなく server action 経由で叩く。
 * backend (`firebase-auth.ts`) は X-Community-Id を tenant 解決と identity 検索の
 * 両方に使うので、sysAdmin の auth identity が住んでいる home community を
 * X-Community-Id に当てる必要がある。home community は HttpOnly な
 * `__session_{community}` cookie からしか確実に判定できないため、サーバ側で
 * 組み立てる。`permission.communityId` には URL の対象 community を入れる。
 */
export const SUBMIT_REPORT_FEEDBACK_SERVER_MUTATION = print(
  addTypenameToDocument(SubmitReportFeedbackDocument),
);
