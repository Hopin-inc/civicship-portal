import { gql } from "@apollo/client";
import { TICKET_CLAIM_LINK_FRAGMENT } from "../ticketClaimLink/fragment";

export const GET_TICKET_ISSUERS = gql`
  query GetTicketIssuers(
    $filter: TicketIssuerFilterInput
    $sort: TicketIssuerSortInput
    $cursor: String
    $first: Int
  ) {
    ticketIssuers(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
  ${TICKET_CLAIM_LINK_FRAGMENT}
`;
