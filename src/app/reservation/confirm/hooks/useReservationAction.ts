import { useCallback } from "react";
import {
  GqlErrorCode,
  GqlReservation,
  GqlUser,
  GqlWallet,
  useCreateReservationMutation,
} from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { ActivityDetail } from "@/app/activities/data/type";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { ApolloError } from "@apollo/client";
import logger from "@/lib/logging";

type Result =
  | { success: true; reservation: GqlReservation }
  | { success: false; code: GqlErrorCode };

interface ReservationParams {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  participantCount: number;
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
      participantCount,
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

      // TODO チケット機能リリース時は、チケット数と参加者数が異なっても良い状態にする
      try {
        const res = await createReservation({
          variables: {
            input: {
              opportunitySlotId: selectedSlot.id,
              totalParticipantCount: participantCount,
              paymentMethod: useTickets ? "TICKET" : "FEE",
              ticketIdsIfNeed: useTickets ? ticketIds : undefined,
              comment: comment ?? undefined,
            },
          },
        });

        const data = res.data?.reservationCreate;
        if (data?.__typename === "ReservationCreateSuccess") {
          logger.info("Reservation created successfully", {
            operation: "createReservation",
            reservationId: data.reservation.id,
            opportunitySlotId: selectedSlot.id,
            userId: user.id
          });
          return {
            success: true,
            reservation: data.reservation,
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
        const isUserError = e instanceof ApolloError && 
          [GqlErrorCode.ValidationError, GqlErrorCode.TicketParticipantMismatch].includes(
            e.graphQLErrors[0]?.extensions?.code as GqlErrorCode
          );
        const logLevel = isUserError ? "info" : "error";
        logger[logLevel]("Reservation mutation failed", {
          operation: "createReservation",
          opportunitySlotId: selectedSlot?.id,
          userId: user?.id,
          isUserError,
          error: e instanceof Error ? e.message : String(e)
        });
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
