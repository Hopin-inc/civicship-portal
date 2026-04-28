import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ADMIN_REPORT_SERVER_QUERY } from "@/graphql/account/report/server";
import type {
  GqlGetAdminReportQuery,
  GqlGetAdminReportQueryVariables,
} from "@/types/graphql";

/**
 * Report detail page で表示する Report 単票を SSR で取得。
 * sysAdmin は全 community のオーナーなので、community 制約なしで叩ける。
 */
export async function fetchAdminReportServer(
  id: string,
): Promise<NonNullable<GqlGetAdminReportQuery["report"]> | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminReportQuery,
      GqlGetAdminReportQueryVariables
    >(GET_ADMIN_REPORT_SERVER_QUERY, { id });
    return data.report ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminReportServer failed", {
      message: (error as Error).message,
      id,
      component: "fetchAdminReportServer",
    });
    return null;
  }
}
