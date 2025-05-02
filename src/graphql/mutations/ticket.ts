import { graphql } from "@/gql";

export const VIEW_TICKET_CLAIM = graphql(`
  query ticketClaimLink($id: ID!) {
    ticketClaimLink(id: $id) {
      qty
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

export const TICKET_CLAIM = graphql(`
  mutation ticketClaim($input: TicketClaimInput!) {
    ticketClaim(input: $input) {
      ...on TicketClaimSuccess {
        tickets {
          id
        }
      }
    }
  }
`);
