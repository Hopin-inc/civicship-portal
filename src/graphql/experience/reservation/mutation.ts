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

export const REJECT_RESERVATION = gql`
  mutation RejectReservation(
    $id: ID!
    $input: ReservationRejectInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    reservationReject(id: $id, input: $input, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          id
          status
          comment
        }
      }
    }
  }
`;
