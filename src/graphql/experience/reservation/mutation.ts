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

export const ACCEPT_RESERVATION_MUTATION = gql`
  mutation ReservationAccept($id: ID!, $permission: CheckOpportunityPermissionInput!) {
    reservationAccept(id: $id, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          id
          status
        }
      }
    }
  }
`;
