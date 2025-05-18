import { gql } from '@apollo/client';
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";

export const GET_OPPORTUNITY_SLOTS = gql`
  query GetOpportunitySlots (
    $filter: OpportunitySlotFilterInput
    $cursor: String
    $first: Int
  ){
    opportunitySlots(
      filter: $filter,
      sort: {startsAt: desc},
      cursor: $cursor,
      first: $first
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
          id
          hostingStatus
          startsAt
          endsAt
          capacity
          remainingCapacity
          opportunity {
            ...OpportunityFields
          }
          reservations {
            participations {
              id
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
  query GetOpportunitySlotWithParticipations($id: ID!, $cursor: String, $first: Int) {
    opportunitySlot(id: $id) {
      ...OpportunitySlotFields
      opportunity {
        ...OpportunityFields
        community {
          id
          name
        }
      }
      reservations {
        participations {
          id
          status
          user {
            id
            name
            image
          }
          evaluation {
            id
            status
          }
        }
      }
      pageInfo @client {
        hasNextPage
        endCursor
      }
    }
  }
  ${SLOT_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
`;  