import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_REPORTS_ALL_SERVER_QUERY } from "@/graphql/account/adminReports/server";
import type { GqlGetReportsAllQuery } from "@/types/graphql";

const PAGE_SIZE = 20;

/**
 * 単一 community のレポート発行履歴を SSR で取得 (1 ページ目)。
 * client-side の追加ロード (もっと見る) は引き続き Apollo fetchMore を使う。
 */
export async function fetchAdminBrowseReportsServer(
  communityId: string,
): Promise<
  NonNullable<GqlGetReportsAllQuery["reportsAll"]> | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetReportsAllQuery,
      {
        communityId?: string | null;
        first?: number | null;
        cursor?: string | null;
      }
    >(GET_REPORTS_ALL_SERVER_QUERY, {
      communityId,
      first: PAGE_SIZE,
    });
    return data.reportsAll ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminBrowseReportsServer failed", {
      message: (error as Error).message,
      communityId,
      component: "fetchAdminBrowseReportsServer",
    });
    return null;
  }
}
