import { gql } from "@apollo/client";

export const GET_COMMUNITY_MEMBERS = gql`
  query GetCommunityMembers(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
  ) {
    memberships(
      first: $first
      cursor: $cursor
      filter: $filter
      sort: $sort
    ) {
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
          createdAt
          headline
          bio
          role
          status
          user {
            id
            name
            image
            bio
          }
          community {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_COMMUNITY_MEMBERS_SERVER_QUERY = `
  query GetCommunityMembers(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
  ) {
    memberships(
      first: $first
      cursor: $cursor
      filter: $filter
      sort: $sort
    ) {
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
          createdAt
          headline
          bio
          role
          status
          user {
            id
            name
            image
            bio
          }
          community {
            id
            name
          }
        }
      }
    }
  }
`;
