import { gql } from "@apollo/client";
import { RESERVATION_FRAGMENT } from "@/graphql/experience/reservation/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";
import { PARTICIPATION_FRAGMENT } from "@/graphql/experience/participation/fragment";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { PLACE_FRAGMENT } from "@/graphql/location/place/fragment";
import { USER_FRAGMENT } from "@/graphql/account/user/fragment";

export const GET_RESERVATIONS = gql`
  query GetReservations(
    $cursor: String
    $sort: ReservationSortInput
    $first: Int
    $filter: ReservationFilterInput
  ) {
    reservations(cursor: $cursor, sort: $sort, first: $first, filter: $filter) {
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
          ...ReservationFields
          createdAt
          createdByUser {
            ...UserFields
          }
          opportunitySlot {
            id
            hostingStatus
            startsAt
            endsAt
            opportunity {
              id
              title
              category
              description
              publishStatus
              requireApproval
            }
          }
          participations {
            id
            status
            reason
            evaluation {
              id
              status
            }
          }
        }
      }
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: ID!, $includeHostArticle: Boolean! = false) {
    reservation(id: $id) {
      ...ReservationFields
      createdByUser {
        ...UserFields
      }
      opportunitySlot {
        isFullyEvaluated
        numParticipants
        numEvaluated
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          slots {
            isFullyEvaluated
            numParticipants
            numEvaluated
            ...OpportunitySlotFields
          }
          community {
            ...CommunityFields
          }
          createdByUser {
            ...UserFields
            articlesAboutMe @include(if: $includeHostArticle) {
              ...ArticleFields
            }
          }
          place {
            ...PlaceFields
          }
        }
      }
      participations {
        ...ParticipationFields
        user {
          ...UserFields
        }
        evaluation {
          ...EvaluationFields
        }
        ticketStatusHistories {
          id
          reason
          status
          ticket {
            id
            reason
            status
          }
        }
      }
    }
  }
  ${RESERVATION_FRAGMENT}
  ${SLOT_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
  ${PLACE_FRAGMENT}
  ${USER_FRAGMENT}
  ${PARTICIPATION_FRAGMENT}
`;
