import { gql } from "@apollo/client";

export const TICKET_CLAIM_LINK_FRAGMENT = gql`
  fragment TicketClaimLinkFields on TicketClaimLink {
    id
    qty
    status
    claimedAt
  }
`;