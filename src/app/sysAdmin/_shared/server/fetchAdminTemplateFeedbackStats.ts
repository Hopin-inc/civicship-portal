import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ADMIN_TEMPLATE_FEEDBACK_STATS_SERVER_QUERY } from "@/graphql/account/adminTemplateFeedbacks/server";
import type {
  GqlGetAdminTemplateFeedbackStatsQuery,
  GqlGetAdminTemplateFeedbackStatsQueryVariables,
} from "@/types/graphql";

/**
 * テンプレ詳細の summary (avgRating / 件数 / rating 分布) を SSR で取得。
 *
 * list 側 (`fetchAdminTemplateFeedbacksServer`) と並行で叩く想定。
 * 引数 (`variant` / `version` / `kind`) は同じ filter object から流す。
 */
export async function fetchAdminTemplateFeedbackStatsServer(
  variables: GqlGetAdminTemplateFeedbackStatsQueryVariables,
): Promise<GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"] | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminTemplateFeedbackStatsQuery,
      GqlGetAdminTemplateFeedbackStatsQueryVariables
    >(GET_ADMIN_TEMPLATE_FEEDBACK_STATS_SERVER_QUERY, variables);
    return data.adminTemplateFeedbackStats ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminTemplateFeedbackStatsServer failed", {
      message: (error as Error).message,
      variables,
      component: "fetchAdminTemplateFeedbackStatsServer",
    });
    return null;
  }
}
