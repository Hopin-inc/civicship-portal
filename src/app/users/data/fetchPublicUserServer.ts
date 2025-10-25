import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlGetUserFlexibleQuery,
  GqlGetUserFlexibleQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_USER_FLEXIBLE } from "@/graphql/account/user/query";

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
      GqlGetUserFlexibleQuery,
      GqlGetUserFlexibleQueryVariables
    >(
      GET_USER_FLEXIBLE,
      {
        id: userId,
        withPortfolios: true,
        withOpportunities: true,
        withNftInstances: false, // 公開ページではNFTを表示しない
        withWallets: false,      // プライベート情報を除外
        withDidIssuanceRequests: false,
      },
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
