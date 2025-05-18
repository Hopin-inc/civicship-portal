import { gql } from '@apollo/client';

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    reservationCreate(input: $input) {
      ... on ReservationCreateSuccess {
        reservation {
          ...ReservationFields
        }
      }
      ... on ReservationFullError {
        __typename
        code
        message
        capacity
        requested
      }
      ... on ReservationAdvanceBookingRequiredError {
        __typename
        code
        message
      }
      ... on ReservationNotAcceptedError {
        __typename
        code
        message
      }
      ... on SlotNotScheduledError {
        __typename
        code
        message
      }
      ... on MissingTicketIdsError {
        __typename
        code
        message
      }
      ... on TicketParticipantMismatchError {
        __typename
        code
        message
        ticketCount
        participantCount
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
