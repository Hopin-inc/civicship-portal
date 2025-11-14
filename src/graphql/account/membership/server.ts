/**
 * サーバーサイド用のMembershipクエリ
 */

export const GET_MEMBERSHIP_LIST_SERVER_QUERY = `
  query GetMembershipListServer(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
    $withWallets: Boolean! = false
    $withDidIssuanceRequests: Boolean! = false
  ) {
    memberships(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
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
          role
          status
          user {
            id
            name
            image
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              status
              didValue
            }
            wallets @include(if: $withWallets) {
              id
              type
              currentPointView {
                currentPoint
              }
              community {
                id
                name
                image
              }
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
`;
