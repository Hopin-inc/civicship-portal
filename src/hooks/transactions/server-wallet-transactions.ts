import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GET_TRANSACTIONS_SERVER_QUERY } from "@/graphql/account/transaction/query";
import {
  GqlGetTransactionsQuery,
  GqlGetTransactionsQueryVariables,
  GqlTransactionsConnection,
} from "@/types/graphql";
import { cookies } from "next/headers";

export interface ServerWalletTransactionsParams {
  walletId: string;
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
 * サーバーサイドでウォレットのトランザクションを取得する関数
 */
export async function getServerWalletTransactions(
  params: ServerWalletTransactionsParams,
): Promise<GqlTransactionsConnection> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { walletId, first = 50, after, withDidIssuanceRequests = true } = params;

  try {
    const variables: GqlGetTransactionsQueryVariables = {
      filter: {
        or: [{ fromWalletId: walletId }, { toWalletId: walletId }],
      },
      first,
      cursor: after,
      withDidIssuanceRequests,
    };

    const data = await executeServerGraphQLQuery<
      GqlGetTransactionsQuery,
      GqlGetTransactionsQueryVariables
    >(GET_TRANSACTIONS_SERVER_QUERY, variables, cookieHeader ? { cookie: cookieHeader } : {});

    return data.transactions ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch wallet transactions:", error);
    return fallbackConnection;
  }
}

/**
 * カーソルベースのページネーションでウォレットのトランザクションを取得する関数
 */
export async function getServerWalletTransactionsWithCursor(
  walletId: string,
  cursor?: string,
  first: number = 20,
): Promise<GqlTransactionsConnection> {
  return getServerWalletTransactions({
    walletId,
    first,
    after: cursor,
  });
}
