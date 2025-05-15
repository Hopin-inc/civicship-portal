import { gql } from "@apollo/client";

export const GET_SINGLE_MEMBERSHIP = gql`
  query GetSingleMembership($communityId: ID!, $userId: ID!) {
    membership(communityId: $communityId, userId: $userId) {
      ...MembershipFields
      participationView {
        hosted {
          ...HostedGeoFields
        }
      }
      user {
        ...UserFields
        articlesAboutMe {
          ...ArticleFields
        }
        opportunitiesCreatedByMe {
          ...OpportunityFields
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
`;

export const GET_MEMBERSHIP_LIST = gql`
  query GetMembershipList(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
    $IsCard: Boolean! = false
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
          participationView {
            hosted {
              ...HostedGeoFields
            }
          }
          hostOpportunityCount @include(if: $IsCard)
          user {
            id
            image
            ...UserFields @include(if: $IsCard)
            articlesAboutMe @include(if: $IsCard) {
              ...ArticleFields
            }
          }
          community @include(if: $IsCard) {
            ...CommunityFields
          }
        }
      }
    }
  }
`;
