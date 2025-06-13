import { gql } from "@apollo/client";

export const GET_UTILITIES = gql`
  query GetUtilities($filter: UtilityFilterInput, $sort: UtilitySortInput, $first: Int) {
    utilities(filter: $filter, sort: $sort, first: $first) {
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
          name
          description
          pointsRequired
          requiredForOpportunities {
            id
            title
            description
            images
            place {
              id
              name
              address
              latitude
              longitude
            }
            feeRequired
            category
            publishStatus
            requireApproval
          }
        }
      }
    }
  }
`;
