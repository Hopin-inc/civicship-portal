import { gql } from "@apollo/client";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { COMMUNITY_FRAGMENT } from "@/graphql/account/community/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";
import { RESERVATION_FRAGMENT } from "@/graphql/experience/reservation/fragment";
import { PARTICIPATION_FRAGMENT } from "@/graphql/experience/participation/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";
import { ARTICLE_FRAGMENT } from "@/graphql/content/article/fragment";

export const GET_OPPORTUNITIES = gql`
  query GetOpportunities(
    $filter: OpportunityFilterInput
    $first: Int
    $cursor: String
  ) {
    opportunities(
      filter: $filter
      sort: { earliestSlotStartsAt: desc }
      first: $first
      cursor: $cursor
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          ...OpportunityFields
          slots {
            ...OpportunitySlotFields
          }
          place {
            ...PlaceFields
          }
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${PLACE_FRAGMENT}
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {
    opportunity(id: $id, permission: $permission) {
      ...OpportunityFields
      
      community {
        ...CommunityFields
      }
      
      place {
        ...PlaceFields
      }
      slots {
        ...OpportunitySlotFields
        reservations {
          ...ReservationFields
          participations {
            ...ParticipationFields
            user {
              ...UserFields
            }
          }
        }
      }
      createdByUser {
        ...UserFields
        articlesAboutMe {
          ...ArticleFields
        }
        opportunitiesCreatedByMe {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          slots {
            ...OpportunitySlotFields
            reservations {
              ...ReservationFields
              participations {
                ...ParticipationFields
                user {
                  ...UserFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${RESERVATION_FRAGMENT}
  ${PARTICIPATION_FRAGMENT}
  ${USER_FRAGMENT}
  ${ARTICLE_FRAGMENT}
`; 