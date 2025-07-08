import { gql } from "@apollo/client";

export const VIEW_TICKET_CLAIM = gql`
  query ticketClaimLink($id: ID!) {
    ticketClaimLink(id: $id) {
      qty
      status
      createdAt
      claimedAt
      issuer {
        owner {
          id
          name
          image
        }
        utility {
          name
          description
        }
        qtyToBeIssued
      }
      tickets {
        wallet {
          user {
            id
            name
          }
        }
      }
    }
  }
`;

export const VIEW_TICKET_CLAIM_LINKS = gql`
  query TicketClaimLinks(
    $filter: TicketClaimLinkFilterInput
    $sort: TicketClaimLinkSortInput
    $cursor: String
    $first: Int
  ) {
    ticketClaimLinks(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
      edges {
        node {
          id
          status
          qty
          claimedAt
          createdAt
          issuer {
            id
            owner {
              id
              name
              image
            }
          }
          tickets {
            status
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
