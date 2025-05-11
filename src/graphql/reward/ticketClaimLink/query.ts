import { gql } from "@apollo/client";

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