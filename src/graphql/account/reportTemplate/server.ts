/**
 * ReportTemplate 用 server-side string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 *
 * codegen で生成される `Get*Document` を `addTypenameToDocument` で
 * `__typename` 注入した上で `print()` する。
 *
 * 注: codegen を初回実行するまで Document import は解決されない。
 * GraphQL document が backend と整合した時点で codegen 実行 → server.ts が機能する。
 */

import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetReportTemplateDocument,
  GetReportTemplateStatsDocument,
} from "@/types/graphql";

export const GET_REPORT_TEMPLATE_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateDocument),
);

export const GET_REPORT_TEMPLATE_STATS_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateStatsDocument),
);
