import { gql } from "@apollo/client";
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";

export const GET_OPPORTUNITY_SLOTS = gql`
  query GetOpportunitySlots(
    $filter: OpportunitySlotFilterInput
    $sort: OpportunitySlotSortInput
    $cursor: String
    $first: Int
  ) {
    opportunitySlots(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
          id
          hostingStatus
          startsAt
          endsAt
          capacity
          remainingCapacity
          isFullyEvaluated
          numParticipants
          numEvaluated
          opportunity {
            ...OpportunityFields
          }
          reservations {
            ...ReservationFields
            participations {
              ...ParticipationFields
              evaluation {
                id
                status
              }
            }
          }
        }
      }
    }
  }
  ${OPPORTUNITY_FRAGMENT}
`;

export const GET_OPPORTUNITY_SLOT = gql`
  query GetOpportunitySlot($id: ID!) {
    opportunitySlot(id: $id) {
      id
    }
  }
`;

export const GET_OPPORTUNITY_SLOT_WITH_PARTICIPATIONS = gql`
  query GetOpportunitySlotWithParticipations($id: ID!) {
    opportunitySlot(id: $id) {
      id
      hostingStatus
      startsAt
      endsAt
      capacity
      remainingCapacity
      isFullyEvaluated
      numParticipants
      numEvaluated
      opportunity {
        ...OpportunityFields
        community {
          ...CommunityFields
        }
      }
      reservations {
        ...ReservationFields
        participations {
          ...ParticipationFields
          user {
            ...UserFields
          }
          evaluation {
            id
            status
          }
        }
      }
    }
  }
  ${SLOT_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
`;

export const GET_SLOT_RESERVATIONS = gql`
  query GetSlotReservations($slotId: ID!) {
    opportunitySlot(id: $slotId) {
      id
      reservations {
        id
        status
      }
    }
  }
`;
