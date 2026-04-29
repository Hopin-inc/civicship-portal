import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import { GetReportsAllDocument } from "@/types/graphql";

/**
 * adminReports 用 server-side string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_REPORTS_ALL_SERVER_QUERY = print(
  addTypenameToDocument(GetReportsAllDocument),
);
