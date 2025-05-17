import { useCallback } from "react";
import { GqlUser, GqlWallet, useCreateReservationMutation } from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { ActivityDetail } from "@/app/activities/data/type";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";

type Result = { success: true; reservationId: string } | { success: false; error: string };

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
      if (loading) return { success: false, error: "IN_PROGRESS" };
      if (!user) return { success: false, error: "NOT_AUTHENTICATED" };
      if (!opportunity || !selectedSlot) return { success: false, error: "MISSING_DATA" };

      const count = ticketCounter.count;
      const ticketIds = useTickets ? getTicketIds(wallets, opportunity.requiredTicket, count) : [];

      if (useTickets && ticketIds.length < count) {
        return { success: false, error: "NOT_ENOUGH_TICKETS" };
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

        const reservation = res.data?.reservationCreate?.reservation;
        if (reservation) return { success: true, reservationId: reservation.id };

        const rawCode = res.errors?.[0]?.extensions?.code;
        const errCode = typeof rawCode === "string" ? rawCode : "UNKNOWN_ERROR";
        return { success: false, error: errCode };
      } catch (e) {
        console.error("Reservation mutation failed", e);
        return { success: false, error: "NETWORK_ERROR" };
      }
    },
    [createReservation, loading],
  );

  return {
    handleReservation,
    creatingReservation: loading,
  };
};
