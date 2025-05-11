import { gql } from '@apollo/client';

export const GET_PLACES = gql`
  query GetPlaces {
    places {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`; 