import { gql } from "@apollo/client";

export const GET_SINGLE_MEMBERSHIP = gql`
  query GetSingleMembership($communityId: ID!, $userKey: String!) {
    membership(communityId: $communityId, userKey: $userKey) {
      ...MembershipFields
      user { ...UserFields }
      community { ...CommunityFields }
    }
  }
`;

export const GET_MEMBERSHIP_LIST = gql`
  query GetMembershipList(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
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
          }
          community {
            ...CommunityFields
          }
        }
      }
    }
  }
`;
