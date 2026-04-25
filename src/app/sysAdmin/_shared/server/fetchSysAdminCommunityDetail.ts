import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_SYS_ADMIN_COMMUNITY_DETAIL_SERVER_QUERY } from "@/graphql/account/sysAdmin/server";
import type {
  GqlGetSysAdminCommunityDetailQuery,
  GqlSysAdminCommunityDetailInput,
} from "@/types/graphql";

type Result = NonNullable<
  GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"]
>;

/**
 * `/sysAdmin/[communityId]` の初期描画データを SSR で取得する。
 * SYS_ADMIN ロールがない / コミュニティが存在しない場合は null を返し、
 * クライアント側で「データの取得に失敗しました」を表示するか
 * `SysAdminGuard` のリダイレクトに任せる。
 */
export async function fetchSysAdminCommunityDetailServer(
  input: GqlSysAdminCommunityDetailInput,
): Promise<Result | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetSysAdminCommunityDetailQuery,
      { input: GqlSysAdminCommunityDetailInput }
    >(GET_SYS_ADMIN_COMMUNITY_DETAIL_SERVER_QUERY, { input });
    return data.sysAdminCommunityDetail ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchSysAdminCommunityDetailServer failed", {
      message: (error as Error).message,
      component: "fetchSysAdminCommunityDetailServer",
    });
    return null;
  }
}
