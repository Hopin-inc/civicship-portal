import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_MEMBER_WALLETS_SERVER_QUERY } from "@/graphql/account/wallet/query";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlGetMemberWalletsQuery,
  GqlGetMemberWalletsQueryVariables,
  GqlWalletsConnection,
} from "@/types/graphql";
import { cookies } from "next/headers";

export interface ServerMemberWalletsParams {
  first?: number;
  after?: string;
  withDidIssuanceRequests?: boolean;
}

const fallbackConnection: GqlWalletsConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

/**
 * サーバーサイドでメンバーウォレットを取得する関数
 */
export async function getServerMemberWallets(
  params: ServerMemberWalletsParams = {},
): Promise<GqlWalletsConnection> {
  const { first = 20, after, withDidIssuanceRequests = true } = params;

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value ?? null;

    const variables: GqlGetMemberWalletsQueryVariables = {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    console.log("[SSR] getServerMemberWallets called", {
      COMMUNITY_ID,
      first,
      after,
      withDidIssuanceRequests,
      hasSession: !!session,
      queryLength: GET_MEMBER_WALLETS_SERVER_QUERY.length,
    });

    const data = session
      ? await executeServerGraphQLQuery<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>(
          GET_MEMBER_WALLETS_SERVER_QUERY,
          variables,
          { Authorization: `Bearer ${session}` }
        )
      : await executeServerGraphQLQuery<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>(
          GET_MEMBER_WALLETS_SERVER_QUERY,
          variables
        );

    console.log("[SSR] getServerMemberWallets result", {
      totalCount: data.wallets?.totalCount,
      edgesLength: data.wallets?.edges?.length,
    });

    return data.wallets ?? fallbackConnection;
  } catch (error) {
    console.error("[SSR] Failed to fetch member wallets:", error);
    console.error("[SSR] Error details:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return fallbackConnection;
  }
}
