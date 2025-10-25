import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_TRANSACTIONS_SERVER_QUERY } from "@/graphql/account/transaction/query";
import { GqlTransactionsConnection, GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables } from "@/types/graphql";
import { getAuthForCommunity, getEnvAuthConfig, type CommunityId } from "@/lib/communities/runtime-auth";

export interface ServerCommunityTransactionsParams {
  communityId: CommunityId;
  first?: number;
  after?: string;
  withDidIssuanceRequests?: boolean;
}

const fallbackConnection: GqlTransactionsConnection = {
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
 * サーバーサイドでコミュニティのトランザクションを取得する関数
 */
export async function getServerCommunityTransactions(
  params: ServerCommunityTransactionsParams
): Promise<GqlTransactionsConnection> {
  const {
    communityId,
    first = 50,
    after,
    withDidIssuanceRequests = true,
  } = params;
  
  const envAuth = getEnvAuthConfig();
  const tenantId = envAuth.tenantId ?? getAuthForCommunity(communityId).tenantId;

  try {
    const variables: GqlGetTransactionsQueryVariables = {
      filter: {
        communityId,
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    const data = await executeServerGraphQLQuery<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>(
      GET_TRANSACTIONS_SERVER_QUERY,
      variables,
      {},
      { tenantId, communityId }
    );

    return data.transactions ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch community transactions:", error);
    return fallbackConnection;
  }
}

/**
 * カーソルベースのページネーションでコミュニティのトランザクションを取得する関数
 */
export async function getServerCommunityTransactionsWithCursor(
  communityId: CommunityId,
  cursor?: string,
  first: number = 20
): Promise<GqlTransactionsConnection> {
  return getServerCommunityTransactions({
    communityId,
    first,
    after: cursor,
  });
}
