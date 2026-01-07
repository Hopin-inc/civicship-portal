import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_TRANSACTIONS_SERVER_QUERY } from "@/graphql/account/transaction/query";
import {
  GqlGetTransactionsQuery,
  GqlGetTransactionsQueryVariables,
  GqlTransactionsConnection,
} from "@/types/graphql";

export interface ServerCommunityTransactionsParams {
  communityId: string;
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
 * @param params.communityId - Runtime community ID from URL path (required)
 */
export async function getServerCommunityTransactions(
  params: ServerCommunityTransactionsParams,
): Promise<GqlTransactionsConnection> {
  const { communityId, first = 20, after, withDidIssuanceRequests = true } = params;

  try {
    const variables: GqlGetTransactionsQueryVariables = {
      filter: {
        communityId: communityId,
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    const data = await executeServerGraphQLQuery<
      GqlGetTransactionsQuery,
      GqlGetTransactionsQueryVariables
    >(GET_TRANSACTIONS_SERVER_QUERY, variables, {
      "X-Community-Id": communityId,
    });

    return data.transactions ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch community transactions:", error);
    return fallbackConnection;
  }
}

/**
 * カーソルベースのページネーションでコミュニティのトランザクションを取得する関数
 * @param communityId - Runtime community ID from URL path (required)
 */
export async function getServerCommunityTransactionsWithCursor(
  communityId: string,
  cursor?: string,
  first: number = 20,
): Promise<GqlTransactionsConnection> {
  return getServerCommunityTransactions({
    communityId,
    first,
    after: cursor,
  });
}
