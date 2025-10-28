/**
 * Server-side GraphQL query strings for wallet operations
 * These are used by server-side fetchers (not Apollo Client hooks)
 */

export const GET_MY_WALLET_WITH_TRANSACTIONS_SERVER_QUERY = `
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
              user {
                id
                name
                image
              }
            }
            toWallet {
              id
              type
              user {
                id
                name
                image
                didIssuanceRequests {
                  status
                  didValue
                }
              }
            }
          }
        }
      }
    }
  }
`;
