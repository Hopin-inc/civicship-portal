import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlTransactionsConnection } from "@/types/graphql";

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

const GET_MY_WALLET_TRANSACTIONS_ONLY_SERVER_QUERY = `
  query GetMyWalletTransactionsOnly(
    $first: Int
    $cursor: String
    $sort: TransactionSortInput
  ) {
    myWallet {
      transactionsConnection(first: $first, cursor: $cursor, sort: $sort) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
        edges {
          cursor
          node {
            id
            reason
            comment
            fromPointChange
            toPointChange
            createdAt
            fromWallet {
              id
              type
              currentPointView {
                currentPoint
              }
              user {
                id
                name
                image
              }
              community {
                id
                name
              }
            }
            toWallet {
              id
              type
              currentPointView {
                currentPoint
              }
              user {
                id
                name
                image
              }
              community {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * カーソルベースのページネーションでマイウォレットのトランザクションのみを取得する関数
 * （infinite scroll用）
 */
export async function getServerMyWalletTransactionsWithCursor(
  session: string,
  cursor?: string,
  first: number = 20
): Promise<GqlTransactionsConnection> {
  try {
    const variables = {
      first,
      cursor,
      sort: { createdAt: 'desc' },
    };

    const data = await executeServerGraphQLQuery<{
      myWallet: {
        transactionsConnection: GqlTransactionsConnection;
      } | null;
    }>(
      GET_MY_WALLET_TRANSACTIONS_ONLY_SERVER_QUERY,
      variables,
      { Authorization: `Bearer ${session}` }
    );

    return data.myWallet?.transactionsConnection ?? fallbackConnection;
  } catch (error) {
    console.error("Failed to fetch my wallet transactions:", error);
    return fallbackConnection;
  }
}
