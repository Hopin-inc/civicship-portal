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
 * backend は `submitReportFeedback` usecase で
 * `ctx.communityId (= X-Community-Id) === report.communityId` を要求するため、
 * リクエストごとに対象 report の community をヘッダに当てる。Apollo client は
 * URL の community で固定するので、別 community の report に投稿する経路では
 * server action 経由でヘッダを差し替える。
 */
export const SUBMIT_REPORT_FEEDBACK_SERVER_MUTATION = print(
  addTypenameToDocument(SubmitReportFeedbackDocument),
);
