import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetAdminBrowseReportsDocument,
  GetAdminReportSummaryDocument,
} from "@/types/graphql";

/**
 * adminReports 用 server-side string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_ADMIN_BROWSE_REPORTS_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminBrowseReportsDocument),
);

export const GET_ADMIN_REPORT_SUMMARY_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminReportSummaryDocument),
);
