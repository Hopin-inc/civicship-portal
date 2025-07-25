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
    $sort: OpportunitySortInput
    $first: Int
    $cursor: String
    $includeSlot: Boolean! = false
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunities(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
          place {
            id
            name
            address
            latitude
            longitude
          }
          slots(filter: $slotFilter, sort: $slotSort) @include(if: $includeSlot) {
            ...OpportunitySlotFields
          }
        }
      }
    }
  }
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity(
    $id: ID!
    $permission: CheckCommunityPermissionInput!
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunity(id: $id, permission: $permission) {
      ...OpportunityFields

      community {
        ...CommunityFields
      }

      place {
        ...PlaceFields
      }
      slots(filter: $slotFilter, sort: $slotSort) {
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
      articles {
        ...ArticleFields
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
      requireApproval
      requiredUtilities {
        id
        pointsRequired
        publishStatus
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
