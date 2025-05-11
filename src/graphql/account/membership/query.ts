import { gql } from "@apollo/client";
import { HOSTED_GEO_FRAGMENT, MEMBERSHIP_FRAGMENT } from "@/graphql/account/membership/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { ARTICLE_FRAGMENT } from "@/graphql/content/article/fragment";
import { COMMUNITY_FRAGMENT } from "@/graphql/account/community/fragment";

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
  ${MEMBERSHIP_FRAGMENT}
  ${HOSTED_GEO_FRAGMENT}
  ${USER_FRAGMENT}
  ${ARTICLE_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
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
          participationView {
            hosted {
              ...HostedGeoFields
            }
          }
          hostOpportunityCount
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
  ${MEMBERSHIP_FRAGMENT}
  ${HOSTED_GEO_FRAGMENT}
  ${USER_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
`;
