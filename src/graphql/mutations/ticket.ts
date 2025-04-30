import { graphql } from "@/gql";

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
