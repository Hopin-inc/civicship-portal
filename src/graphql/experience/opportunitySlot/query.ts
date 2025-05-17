import { gql } from '@apollo/client';
import { OPPORTUNITY_FRAGMENT } from "@/graphql/experience/opportunity/fragment";
import { SLOT_FRAGMENT } from "@/graphql/experience/opportunitySlot/fragment";

export const GET_OPPORTUNITY_SLOTS = gql`
  query GetOpportunitySlots (
    $filter: OpportunitySlotFilterInput
  ){
    opportunitySlots(
      filter: $filter,
      sort: {startsAt: desc},
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
      ...OpportunitySlotFields
      opportunity {
        ...OpportunityFields
      }
      participations {
        id
        status
        user {
          id
          name
          profileImageUrl
        }
        evaluation {
          id
          status
        }
      }
    }
  }
  ${SLOT_FRAGMENT}
  ${OPPORTUNITY_FRAGMENT}
`; 