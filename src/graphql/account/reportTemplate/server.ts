import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetReportTemplateDocument,
  GetReportTemplateStatsBreakdownDocument,
  GetReportTemplateStatsDocument,
  GetReportTemplatesDocument,
} from "@/types/graphql";

/**
 * reportTemplate 系 server-side string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_REPORT_TEMPLATE_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateDocument),
);

export const GET_REPORT_TEMPLATE_STATS_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateStatsDocument),
);

export const GET_REPORT_TEMPLATES_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplatesDocument),
);

export const GET_REPORT_TEMPLATE_STATS_BREAKDOWN_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateStatsBreakdownDocument),
);
