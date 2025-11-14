import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_MEMBER_WALLETS } from "@/graphql/account/wallet/query";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlGetMemberWalletsQuery,
  GqlGetMemberWalletsQueryVariables,
  GqlWalletsConnection,
} from "@/types/graphql";

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
    const variables: GqlGetMemberWalletsQueryVariables = {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    const data = await executeServerGraphQLQuery<
      GqlGetMemberWalletsQuery,
      GqlGetMemberWalletsQueryVariables
    >(GET_MEMBER_WALLETS.loc?.source.body ?? "", variables);

    return data.wallets ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch member wallets:", error);
    return fallbackConnection;
  }
}

/**
 * カーソルベースのページネーションでメンバーウォレットを取得する関数
 */
export async function getServerMemberWalletsWithCursor(
  cursor?: string,
  first: number = 20,
): Promise<GqlWalletsConnection> {
  return getServerMemberWallets({
    first,
    after: cursor,
  });
}
