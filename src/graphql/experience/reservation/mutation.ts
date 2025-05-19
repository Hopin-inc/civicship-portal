import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    reservationCreate(input: $input) {
      ... on ReservationCreateSuccess {
        reservation {
          ...ReservationFields
        }
      }
    }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation(
    $id: ID!
    $input: ReservationCancelInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    reservationCancel(id: $id, input: $input, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          ...ReservationFields
        }
      }
    }
  }
`;
