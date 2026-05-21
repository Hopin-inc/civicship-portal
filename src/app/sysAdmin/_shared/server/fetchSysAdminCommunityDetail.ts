import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ANALYTICS_COMMUNITY_SERVER_QUERY } from "@/graphql/account/sysAdmin/server";
import type {
  GqlGetAnalyticsCommunityQuery,
  GqlAnalyticsCommunityInput,
} from "@/types/graphql";

type Result = NonNullable<
  GqlGetAnalyticsCommunityQuery["analyticsCommunity"]
>;

// analyticsCommunity は 12 ヶ月トレンド + 週次リテンション + コホート 2 種 +
// 最大 1000 件のメンバー集計を含む重いクエリで、executeServerGraphQLQuery の
// デフォルト 5 秒では SSR がタイムアウトしやすい。タイムアウトすると initialData が
// null になり、クライアント側フォールバッククエリ（cross-origin で認証が乗らず失敗する）
// に落ちるため、この SSR フェッチだけ長めのタイムアウトを取る。
const ANALYTICS_COMMUNITY_SERVER_TIMEOUT_MS = 20000;

/**
 * `/sysAdmin/[communityId]` の初期描画データを SSR で取得する。
 * SYS_ADMIN ロールがない / コミュニティが存在しない場合は null を返し、
 * クライアント側で「データの取得に失敗しました」を表示するか
 * `SysAdminGuard` のリダイレクトに任せる。
 */
export async function fetchSysAdminCommunityDetailServer(
  input: GqlAnalyticsCommunityInput,
): Promise<Result | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAnalyticsCommunityQuery,
      { input: GqlAnalyticsCommunityInput }
    >(
      GET_ANALYTICS_COMMUNITY_SERVER_QUERY,
      { input },
      {},
      ANALYTICS_COMMUNITY_SERVER_TIMEOUT_MS,
    );
    return data.analyticsCommunity ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchSysAdminCommunityDetailServer failed", {
      message: (error as Error).message,
      component: "fetchSysAdminCommunityDetailServer",
    });
    return null;
  }
}
