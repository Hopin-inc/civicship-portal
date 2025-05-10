import { gql } from "@apollo/client";

export const TICKET_FRAGMENT = gql`
  fragment TicketFields on Ticket {
    id
    reason
    status
  }
`; 