import { gql } from "@apollo/client";

export const TICKET_ISSUE = gql`
  mutation ticketIssue($input: TicketIssueInput!) {
    ticketIssue(input: $input) {
      ... on TicketIssueSuccess {
        issue {
          id
          qtyToBeIssued
          claimLink {
            ...TicketClaimLinkFields
          }
          utility {
            ...UtilityFields
          }
        }
      }
    }
  }
`;

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
