/**
 * サーバーサイド用のGraphQLクエリ
 */

export const GET_TRANSACTIONS_SERVER_QUERY = `
  query getTransactions(
    $filter: TransactionFilterInput
    $sort: TransactionSortInput
    $first: Int
    $cursor: String
    $withDidIssuanceRequests: Boolean = false
  ) {
    transactions(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
              bio
              currentPrefecture
              phoneNumber
              nftWallet {
                id
                walletAddress
              }
              urlFacebook
              urlInstagram
              urlX
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                id
                status
                didValue
                requestedAt
                processedAt
                completedAt
                createdAt
                updatedAt
              }
            }
            community {
              id
              name
              image
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
              bio
              currentPrefecture
              phoneNumber
              nftWallet {
                id
                walletAddress
              }
              urlFacebook
              urlInstagram
              urlX
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                id
                status
                didValue
                requestedAt
                processedAt
                completedAt
                createdAt
                updatedAt
              }
            }
            community {
              id
              name
              image
            }
          }
        }
      }
    }
  }
`;

// サーバーサイド用のGraphQLクエリ実行関数は src/lib/graphql/server.ts に移動しました
