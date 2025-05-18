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
        message
        capacity
        requested
      }
      ... on ReservationAdvanceBookingRequiredError {
        __typename
        message
      }
      ... on ReservationNotAcceptedError {
        __typename
        message
      }
      ... on SlotNotScheduledError {
        __typename
        message
      }
      ... on MissingTicketIdsError {
        __typename
        message
      }
      ... on TicketParticipantMismatchError {
        __typename
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
      ... on ReservationCancellationTimeoutError {
        message
      }
    }
  }
`;
