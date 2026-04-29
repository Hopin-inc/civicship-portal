import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_REPORT_TEMPLATE_FEEDBACKS_SERVER_QUERY } from "@/graphql/account/reportTemplateFeedbacks/server";
import type {
  GqlGetReportTemplateFeedbacksQuery,
  GqlGetReportTemplateFeedbacksQueryVariables,
} from "@/types/graphql";

const PAGE_SIZE = 20;

/**
 * テンプレ詳細の feedback feed の 1 ページ目を SSR で取得。
 * 「もっと見る」は client-side で Apollo client.query を叩く想定。
 */
export async function fetchAdminTemplateFeedbacksServer(
  variables: GqlGetReportTemplateFeedbacksQueryVariables,
): Promise<
  NonNullable<GqlGetReportTemplateFeedbacksQuery["reportTemplateFeedbacks"]> | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetReportTemplateFeedbacksQuery,
      GqlGetReportTemplateFeedbacksQueryVariables
    >(GET_REPORT_TEMPLATE_FEEDBACKS_SERVER_QUERY, {
      first: PAGE_SIZE,
      ...variables,
    });
    return data.reportTemplateFeedbacks ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminTemplateFeedbacksServer failed", {
      message: (error as Error).message,
      variables,
      component: "fetchAdminTemplateFeedbacksServer",
    });
    return null;
  }
}
