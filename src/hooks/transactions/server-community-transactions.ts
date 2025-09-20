import { executeGraphQLQuery, GET_TRANSACTIONS_SERVER_QUERY } from "@/graphql/account/transaction/query";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlTransactionsConnection, GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables } from "@/types/graphql";
import { toast } from "sonner";

export interface ServerCommunityTransactionsParams {
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
  params: ServerCommunityTransactionsParams = {}
): Promise<GqlTransactionsConnection> {
  const {
    first = 50,
    after,
    withDidIssuanceRequests = true,
  } = params;

  try {
    const variables: GqlGetTransactionsQueryVariables = {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    const data = await executeGraphQLQuery<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>(
      GET_TRANSACTIONS_SERVER_QUERY,
      variables
    );

    return (data.transactions as GqlTransactionsConnection) ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch community transactions:", error);
    toast.error("データの取得に失敗しました");
    return fallbackConnection;
  }
}

/**
 * カーソルベースのページネーションでコミュニティのトランザクションを取得する関数
 */
export async function getServerCommunityTransactionsWithCursor(
  cursor?: string,
  first: number = 20
): Promise<GqlTransactionsConnection> {
  return getServerCommunityTransactions({
    first,
    after: cursor,
  });
}
