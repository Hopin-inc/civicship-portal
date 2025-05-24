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
      edges {
        node {
          id
          status
          createdAt
          createdByUser {
            id
            name
            image
          }
          opportunitySlot {
            id
            startsAt
            endsAt
            opportunity {
              id
              title
            }
          }
          participations {
            id
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      ...ReservationFields
      createdByUser {
        ...UserFields
        phoneNumber
      }
      opportunitySlot {
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          slots {
            ...OpportunitySlotFields
          }
          community {
            id
            name
          }
          createdByUser {
            ...UserFields
          }
          place {
            ...PlaceFields
          }
        }
      }
      participations {
        ...ParticipationFields
        id
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
