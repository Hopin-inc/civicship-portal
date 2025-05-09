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

export const VIEW_TICKET_CLAIM = gql(`
  query ticketClaimLink($id: ID!) {
    ticketClaimLink(id: $id) {
      qty
      status
      issuer {
        owner {
          id
          name
          image
        }
      }
    }
  }
`);

export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
    }
  }
`;
