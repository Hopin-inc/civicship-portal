import { gql } from "@apollo/client";

export const OPPORTUNITY_FRAGMENT = gql`
  fragment OpportunityFields on Opportunity {
    id
    title
    description
    body
    images

    category
    publishStatus
    isReservableWithTicket
    requireApproval

    feeRequired
    pointsToEarn
    pointsRequired

    earliestReservableAt
  }
`;