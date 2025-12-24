import { gql } from "@apollo/client";

// =====================================
// GET SLOT RESERVATIONS
// =====================================
export const GET_SLOT_RESERVATIONS = gql`
  query GetSlotReservations($slotId: ID!) {
    opportunitySlot(id: $slotId) {
      id
      reservations {
        id
        status
        user {
          id
          name
        }
      }
    }
  }
`;
