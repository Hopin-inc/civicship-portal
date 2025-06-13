import { gql } from "@apollo/client";

export const GET_TICKETS = gql`
  query GetTickets(
    $filter: TicketFilterInput
    $sort: TicketSortInput
    $cursor: String
    $first: Int
  ) {
    tickets(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
          ...TicketFields
          claimLink {
            ...TicketClaimLinkFields
            issuer {
              id
              qtyToBeIssued
              owner {
                ...UserFields
              }
            }
          }
        }
      }
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
