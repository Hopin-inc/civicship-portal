import { useCallback } from "react";
import { GqlErrorCode, GqlUser, GqlWallet, useCreateReservationMutation } from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { ActivityDetail } from "@/app/activities/data/type";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";

type Result =
  | { success: true; reservationId: string; typename: string }
  | { success: false; error: string; code?: GqlErrorCode; typename?: string };

interface ReservationParams {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  useTickets: boolean;
}

export const useReservationCommand = () => {
  const [createReservation, { loading }] = useCreateReservationMutation();

  const handleReservation = useCallback(
    async ({
             opportunity,
             selectedSlot,
             wallets,
             user,
             ticketCounter,
             useTickets,
           }: ReservationParams): Promise<Result> => {
      if (loading) return { success: false, error: "Reservation is already in progress." };
      if (!user) return { success: false, error: "User is not authenticated." };
      if (!opportunity || !selectedSlot) return { success: false, error: "Missing opportunity or slot data." };

      const count = ticketCounter.count;
      const ticketIds = useTickets ? getTicketIds(wallets, opportunity.requiredTicket, count) : [];

      if (useTickets && ticketIds.length < count) {
        return { success: false, error: "Not enough tickets available." };
      }

      try {
        const res = await createReservation({
          variables: {
            input: {
              opportunitySlotId: selectedSlot.id,
              totalParticipantCount: count,
              paymentMethod: useTickets ? "TICKET" : "FEE",
              ticketIdsIfNeed: useTickets ? ticketIds : undefined,
            },
          },
        });

        const data = res.data?.reservationCreate;
        if (data?.__typename === "ReservationCreateSuccess") {
          return { success: true, reservationId: data.reservation.id, typename: "ReservationCreateSuccess" };
        } else if (data?.__typename === "ReservationFullError") {
          return { success: false, error: `Full Error: Capacity ${data.capacity}, Requested ${data.requested}`, code: data.code, typename: "ReservationFullError" };
        } else if (data?.__typename === "ReservationAdvanceBookingRequiredError") {
          return { success: false, error: "Advance booking required.", code: data.code, typename: "ReservationAdvanceBookingRequiredError" };
        } else if (data?.__typename === "ReservationNotAcceptedError") {
          return { success: false, error: "Reservation not accepted.", code: data.code, typename: "ReservationNotAcceptedError" };
        } else if (data?.__typename === "SlotNotScheduledError") {
          return { success: false, error: "Slot not scheduled.", code: data.code, typename: "SlotNotScheduledError" };
        } else if (data?.__typename === "MissingTicketIdsError") {
          return { success: false, error: "Missing ticket IDs.", code: data.code, typename: "MissingTicketIdsError" };
        } else if (data?.__typename === "TicketParticipantMismatchError") {
          return { success: false, error: `Ticket mismatch: ${data.ticketCount} tickets, ${data.participantCount} participants`, code: data.code, typename: "TicketParticipantMismatchError" };
        } else {
          return { success: false, error: "Unknown error.", typename: "UnknownError" };
        }
      } catch (e) {
        console.error("Reservation mutation failed", e);
        return { success: false, error: "Network error occurred.", typename: "NetworkError" };
      }
    },
    [createReservation, loading],
  );

  return {
    handleReservation,
    creatingReservation: loading,
  };
};
