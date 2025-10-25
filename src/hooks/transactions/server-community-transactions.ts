import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_TRANSACTIONS_SERVER_QUERY } from "@/graphql/account/transaction/query";
import { GqlTransactionsConnection, GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables } from "@/types/graphql";
import { getEnvCommunityId, resolveCommunityIdFromHost, getAuthForCommunity, getEnvAuthConfig } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";
import { headers } from "next/headers";

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

  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";
  const envCommunityId = getEnvCommunityId();
  const communityId = envCommunityId ?? resolveCommunityIdFromHost(host);
  
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
  cursor?: string,
  first: number = 20
): Promise<GqlTransactionsConnection> {
  return getServerCommunityTransactions({
    first,
    after: cursor,
  });
}
