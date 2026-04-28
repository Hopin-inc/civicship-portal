import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_SYS_ADMIN_DASHBOARD_SERVER_QUERY } from "@/graphql/account/sysAdmin/server";
import type {
  GqlGetSysAdminDashboardQuery,
  GqlSysAdminDashboardInput,
} from "@/types/graphql";

type Result = NonNullable<GqlGetSysAdminDashboardQuery["sysAdminDashboard"]>;

/**
 * `/sysAdmin` の初期描画データを SSR で取得する。
 * SYS_ADMIN ロールを持たないアカウントでは 403 / GraphQL エラーが返るため、
 * fetch エラーは null に倒してクライアント側 (`SysAdminGuard`) のリダイレクトに任せる。
 */
export async function fetchSysAdminDashboardServer(
  input: GqlSysAdminDashboardInput,
): Promise<Result | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetSysAdminDashboardQuery,
      { input: GqlSysAdminDashboardInput }
    >(GET_SYS_ADMIN_DASHBOARD_SERVER_QUERY, { input });
    return data.sysAdminDashboard ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchSysAdminDashboardServer failed", {
      message: (error as Error).message,
      component: "fetchSysAdminDashboardServer",
    });
    return null;
  }
}
