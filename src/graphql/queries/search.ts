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
      edges {
        node {
          id
          title
          description
          category
          capacity
          community {
            id
            name
            image
          }
          pointsToEarn
          feeRequired
          requireApproval
          publishStatus
          images
          createdAt
          updatedAt
          place {
            id
            name
            address
            latitude
            longitude
            city {
              name
              state {
                name
              }
            }
          }
          slots {
            edges {
              node {
                id
                startsAt
                endsAt
                capacity
                participations {
                  edges {
                    node {
                      id
                      status
                      user {
                        id
                        name
                        image
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`; 