import { gql } from '@apollo/client';

export const GET_OPPORTUNITY_SLOTS = gql`
  query GetOpportunitySlots {
    opportunitySlots {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

export const GET_OPPORTUNITY_SLOT = gql`
  query GetOpportunitySlot($id: ID!) {
    opportunitySlot(id: $id) {
      id
    }
  }
`; 