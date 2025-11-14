"use server";

import { cookies } from "next/headers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_MEMBER_WALLETS_SERVER_QUERY } from "@/graphql/account/wallet/query";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlGetMemberWalletsQuery,
  GqlGetMemberWalletsQueryVariables,
  GqlWalletsConnection,
} from "@/types/graphql";

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
 * Server Action: カーソルベースのページネーションでメンバーウォレットを取得
 */
export async function getServerMemberWalletsWithCursor(
  cursor?: string,
  first: number = 20,
): Promise<GqlWalletsConnection> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value ?? null;

    const variables: GqlGetMemberWalletsQueryVariables = {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first,
      cursor,
      withDidIssuanceRequests: true,
    };

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

    return data.wallets ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch member wallets with cursor:", error);
    return fallbackConnection;
  }
}
