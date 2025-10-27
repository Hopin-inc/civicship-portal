import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { GqlTransactionsConnection } from "@/types/graphql";

export interface MyWalletWithTransactionsResult {
  wallet: {
    id: string;
    type: string;
    currentPoint: bigint;
    accumulatedPoint: bigint;
    user?: {
      id: string;
      name: string;
      image?: string | null;
    } | null;
    community?: {
      id: string;
      name: string;
    } | null;
  } | null;
  transactions: GqlTransactionsConnection;
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

const GET_MY_WALLET_WITH_TRANSACTIONS_SERVER_QUERY = `
  query GetMyWalletWithTransactions(
    $first: Int
    $cursor: String
    $sort: TransactionSortInput
  ) {
    myWallet {
      id
      type
      currentPointView {
        currentPoint
      }
      accumulatedPointView {
        accumulatedPoint
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
 * サーバーサイドでマイウォレット情報とトランザクションを統合取得する関数
 */
export async function getServerMyWalletWithTransactions(
  session: string,
  params: { first?: number; after?: string } = {}
): Promise<MyWalletWithTransactionsResult> {
  const { first = 20, after } = params;

  try {
    const variables = {
      first,
      cursor: after,
      sort: { createdAt: 'desc' },
    };

    const data = await executeServerGraphQLQuery<{
      myWallet: {
        id: string;
        type: string;
        currentPointView: { currentPoint: string } | null;
        accumulatedPointView: { accumulatedPoint: string } | null;
        user?: {
          id: string;
          name: string;
          image?: string | null;
        } | null;
        community?: {
          id: string;
          name: string;
        } | null;
        transactionsConnection: GqlTransactionsConnection;
      } | null;
    }>(
      GET_MY_WALLET_WITH_TRANSACTIONS_SERVER_QUERY,
      variables,
      { Authorization: `Bearer ${session}` }
    );

    const myWallet = data.myWallet;

    if (!myWallet) {
      return {
        wallet: null,
        transactions: fallbackConnection,
      };
    }

    return {
      wallet: {
        id: myWallet.id,
        type: myWallet.type,
        currentPoint: BigInt(myWallet.currentPointView?.currentPoint ?? '0'),
        accumulatedPoint: BigInt(myWallet.accumulatedPointView?.accumulatedPoint ?? '0'),
        user: myWallet.user,
        community: myWallet.community,
      },
      transactions: myWallet.transactionsConnection ?? fallbackConnection,
    };
  } catch (error) {
    console.error("Failed to fetch my wallet with transactions:", error);
    return {
      wallet: null,
      transactions: fallbackConnection,
    };
  }
}
