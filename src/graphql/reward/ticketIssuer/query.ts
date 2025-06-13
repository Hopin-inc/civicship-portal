import { gql } from "@apollo/client";

export const GET_TICKET_ISSUERS = gql`
  query GetTicketIssuers(
    $filter: TicketIssuerFilterInput
    $sort: TicketIssuerSortInput
    $first: Int
  ) {
    ticketIssuers(filter: $filter, sort: $sort, first: $first) {
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
          qtyToBeIssued
          createdAt
          utility {
            id
            name
          }
          claimLink {
            ...TicketClaimLinkFields
          }
          owner {
            id
            name
            image
          }
        }
      }
    }
  }
`;
