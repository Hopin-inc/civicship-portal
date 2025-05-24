import { useCallback } from "react";
import { GqlErrorCode, GqlUser, GqlWallet, useCreateReservationMutation } from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { ActivityDetail } from "@/app/activities/data/type";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { ApolloError } from "@apollo/client";

type Result = { success: true; reservationId: string } | { success: false; code: GqlErrorCode };

interface ReservationParams {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  useTickets: boolean;
  comment?: string;
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
      comment,
    }: ReservationParams): Promise<Result> => {
      if (loading) return { success: false, code: GqlErrorCode.Unknown };
      if (!user) return { success: false, code: GqlErrorCode.Unauthenticated };
      if (!opportunity || !selectedSlot)
        return { success: false, code: GqlErrorCode.ValidationError };

      const count = ticketCounter.count;
      const ticketIds = useTickets ? getTicketIds(wallets, opportunity.requiredTicket, count) : [];

      if (useTickets && ticketIds.length < count) {
        return { success: false, code: GqlErrorCode.TicketParticipantMismatch };
      }

      try {
        const res = await createReservation({
          variables: {
            input: {
              opportunitySlotId: selectedSlot.id,
              totalParticipantCount: count,
              paymentMethod: useTickets ? "TICKET" : "FEE",
              ticketIdsIfNeed: useTickets ? ticketIds : undefined,
              comment,
            },
          },
        });

        const data = res.data?.reservationCreate;
        if (data?.__typename === "ReservationCreateSuccess") {
          return {
            success: true,
            reservationId: data.reservation.id,
          };
        } else {
          return { success: false, code: GqlErrorCode.Unknown };
        }
      } catch (e) {
        if (e instanceof ApolloError) {
          const gqlError = e.graphQLErrors[0];
          const code = gqlError.extensions?.code as GqlErrorCode | undefined;

          return {
            success: false,
            code: code ?? GqlErrorCode.Unknown,
          };
        }
        console.error("Reservation mutation failed", e);
        return { success: false, code: GqlErrorCode.Unknown };
      }
    },
    [createReservation, loading],
  );

  return {
    handleReservation,
    creatingReservation: loading,
  };
};
