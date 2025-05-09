import { gql } from '@apollo/client';

export const GET_UTILITIES = gql`
  query GetUtilities {
    utilities {
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