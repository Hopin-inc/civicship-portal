import { gql } from '@apollo/client';

export const GET_TICKETS = gql`
  query GetTickets {
    tickets {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
    }
  }
`;
