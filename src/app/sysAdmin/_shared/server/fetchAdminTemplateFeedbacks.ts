import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ADMIN_TEMPLATE_FEEDBACKS_SERVER_QUERY } from "@/graphql/account/adminTemplateFeedbacks/server";
import type {
  GqlGetAdminTemplateFeedbacksQuery,
  GqlGetAdminTemplateFeedbacksQueryVariables,
} from "@/types/graphql";

const PAGE_SIZE = 20;

/**
 * テンプレ詳細の feedback feed の 1 ページ目を SSR で取得。
 * 「もっと見る」は client-side で Apollo client.query を叩く想定。
 */
export async function fetchAdminTemplateFeedbacksServer(
  variables: GqlGetAdminTemplateFeedbacksQueryVariables,
): Promise<
  NonNullable<GqlGetAdminTemplateFeedbacksQuery["adminTemplateFeedbacks"]> | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminTemplateFeedbacksQuery,
      GqlGetAdminTemplateFeedbacksQueryVariables
    >(GET_ADMIN_TEMPLATE_FEEDBACKS_SERVER_QUERY, {
      first: PAGE_SIZE,
      ...variables,
    });
    return data.adminTemplateFeedbacks ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminTemplateFeedbacksServer failed", {
      message: (error as Error).message,
      variables,
      component: "fetchAdminTemplateFeedbacksServer",
    });
    return null;
  }
}
