import { graphql } from "@/gql";

export const VIEW_TICKET_CLAIM = graphql(`
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
