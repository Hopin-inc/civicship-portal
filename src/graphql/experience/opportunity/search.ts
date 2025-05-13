import { gql } from '@apollo/client';

export const SEARCH_OPPORTUNITIES = gql`
  query SearchOpportunities(
    $filter: OpportunityFilterInput
    $first: Int
  ) {
    opportunities(
      filter: $filter
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
        }
      }
    }
  }
`; 