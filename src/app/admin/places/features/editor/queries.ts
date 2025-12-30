import { gql } from "@apollo/client";

export const GET_STATES = gql`
  query GetStates($first: Int) {
    states(first: $first) {
      edges {
        node {
          code
          name
        }
      }
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($filter: CitiesInput, $first: Int, $cursor: String, $sort: CitiesSortInput) {
    cities(filter: $filter, first: $first, cursor: $cursor, sort: $sort) {
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
          code
          name
          state {
            code
            name
          }
        }
      }
    }
  }
`;
