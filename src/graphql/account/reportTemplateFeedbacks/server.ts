import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetReportTemplateFeedbackStatsDocument,
  GetReportTemplateFeedbacksDocument,
} from "@/types/graphql";

/**
 * reportTemplateFeedbacks の SSR 用 string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_REPORT_TEMPLATE_FEEDBACKS_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateFeedbacksDocument),
);

export const GET_REPORT_TEMPLATE_FEEDBACK_STATS_SERVER_QUERY = print(
  addTypenameToDocument(GetReportTemplateFeedbackStatsDocument),
);
