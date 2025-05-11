import { gql } from "@apollo/client";

export const CREATE_RESERVATION_MUTATION = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    reservationCreate(input: $input) {
      ... on ReservationCreateSuccess {
        reservation {
          id
          status
        }
      }
    }
  }
`;
