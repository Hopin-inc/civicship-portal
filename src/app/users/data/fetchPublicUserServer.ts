import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlUser } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_PUBLIC_USER_SERVER_QUERY } from "@/graphql/account/user/server";

/**
 * 公開プロフィール用のサーバー側データ取得
 * プライベート情報 (wallet, tickets, points) を含まない
 * 
 * @param userId - 取得するユーザーのID
 * @returns GqlUser | null
 */
export async function fetchPublicUserServer(
  userId: string
): Promise<GqlUser | null> {
  try {
    const res = await executeServerGraphQLQuery<
      { user: GqlUser | null },
      { id: string }
    >(
      GET_PUBLIC_USER_SERVER_QUERY,
      { id: userId },
      {} // 認証ヘッダーなし（公開情報のみ取得）
    );

    return res.user ?? null;
  } catch (error) {
    logger.error("⚠️ Failed to fetch public user (SSR):", {
      userId,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return null;
  }
}
