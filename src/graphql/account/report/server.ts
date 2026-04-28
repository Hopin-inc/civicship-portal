import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetAdminReportDocument,
  GetAdminReportFeedbacksDocument,
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
