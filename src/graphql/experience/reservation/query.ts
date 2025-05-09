import { gql } from '@apollo/client';

export const GET_RESERVATIONS = gql`
  query GetReservations {
    reservations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

export const GET_RESERVATION = gql`
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      id
    }
  }
`; 