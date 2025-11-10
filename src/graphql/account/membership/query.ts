import { gql } from "@apollo/client";
import { MEMBERSHIP_FRAGMENT } from "./fragment";

export const GET_SINGLE_MEMBERSHIP = gql`
  query GetSingleMembership($communityId: ID!, $userId: ID!) {
    membership(communityId: $communityId, userId: $userId) {
      ...MembershipFields
      user {
        ...UserFields
      }
      community {
        ...CommunityFields
      }
    }
  }
`;

export const GET_MEMBERSHIP_LIST = gql`
  query GetMembershipList(
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
