import { addTypenameToDocument } from "@apollo/client/utilities";
import { print } from "graphql/language/printer";
import {
  GetAdminTemplateFeedbackStatsDocument,
  GetAdminTemplateFeedbacksDocument,
} from "@/types/graphql";

/**
 * adminTemplateFeedbacks の SSR 用 string query。
 * 詳細は `graphql/account/sysAdmin/server.ts` のコメント参照。
 */
export const GET_ADMIN_TEMPLATE_FEEDBACKS_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminTemplateFeedbacksDocument),
);

export const GET_ADMIN_TEMPLATE_FEEDBACK_STATS_SERVER_QUERY = print(
  addTypenameToDocument(GetAdminTemplateFeedbackStatsDocument),
);
