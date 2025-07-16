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
          ...MembershipFields
          user {
            ...UserFields
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              ...DidIssuanceRequestFields
            }
            wallets @include(if: $withWallets) {
              ...WalletFields
              community {
                ...CommunityFields
              }
            }
          }
          community {
            ...CommunityFields
          }
        }
      }
    }
  }
  ${MEMBERSHIP_FRAGMENT}
`;
