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

/**
 * GraphQLリクエストを実行するヘルパー関数
 */
export async function executeGraphQLQuery<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables: TVariables,
  headers: Record<string, string> = {}
): Promise<TData> {
  const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Civicship-Tenant': process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
      'X-Community-Id': process.env.NEXT_PUBLIC_COMMUNITY_ID!,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(`GraphQL errors: ${result.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return result.data;
}
