import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ANALYTICS_DASHBOARD_SERVER_QUERY } from "@/graphql/account/sysAdmin/server";
import type {
  GqlGetAnalyticsDashboardQuery,
  GqlAnalyticsDashboardInput,
} from "@/types/graphql";

type Result = NonNullable<GqlGetAnalyticsDashboardQuery["analyticsDashboard"]>;

/**
 * `/sysAdmin` の初期描画データを SSR で取得する。
 * SYS_ADMIN ロールを持たないアカウントでは 403 / GraphQL エラーが返るため、
 * fetch エラーは null に倒してクライアント側 (`SysAdminGuard`) のリダイレクトに任せる。
 */
export async function fetchSysAdminDashboardServer(
  input: GqlAnalyticsDashboardInput,
): Promise<Result | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAnalyticsDashboardQuery,
      { input: GqlAnalyticsDashboardInput }
    >(GET_ANALYTICS_DASHBOARD_SERVER_QUERY, { input });
    return data.analyticsDashboard ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchSysAdminDashboardServer failed", {
      message: (error as Error).message,
      component: "fetchSysAdminDashboardServer",
    });
    return null;
  }
}
