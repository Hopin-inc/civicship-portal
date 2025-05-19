import { gql } from "@apollo/client";

export const TICKET_CLAIM = gql`
  mutation ticketClaim($input: TicketClaimInput!) {
    ticketClaim(input: $input) {
      ... on TicketClaimSuccess {
        tickets {
          id
        }
      }
    }
  }
`;
