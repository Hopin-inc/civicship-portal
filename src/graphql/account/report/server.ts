import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import { GetAdminReportDocument } from "@/types/graphql";

/**
 * Report detail page 用の SSR 用 string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_ADMIN_REPORT_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminReportDocument),
);
