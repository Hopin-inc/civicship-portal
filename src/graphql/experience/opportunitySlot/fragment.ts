import { gql } from "@apollo/client";

export const SLOT_FRAGMENT = gql`
  fragment OpportunitySlotFields on OpportunitySlot {
    id
    hostingStatus

    startsAt
    endsAt

    capacity
    remainingCapacity
  }
`;