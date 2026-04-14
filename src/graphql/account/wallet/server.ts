/**
 * Server-side GraphQL query strings for wallet operations
 * These are used by server-side fetchers (not Apollo Client hooks)
 */

export const GET_COMMUNITY_WALLET_SERVER_QUERY = `
  query GetCommunityWalletServer($communityId: ID!) {
    wallets(filter: { type: COMMUNITY, communityId: $communityId }) {
      edges {
        node {
          id
          currentPointView {
            currentPoint
          }
          community {
            id
          }
        }
      }
    }
  }
`;

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
            images
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
