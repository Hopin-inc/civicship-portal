import { gql } from "@apollo/client";

export const RESERVATION_FRAGMENT = gql`
  fragment ReservationFields on Reservation {
    status
    participations {
      ...ParticipationFields
    }
  }
`;
