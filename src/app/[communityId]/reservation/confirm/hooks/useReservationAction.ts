import { useCallback } from "react";
import {
  GqlErrorCode,
  GqlReservation,
  GqlUser,
  useCreateReservationMutation,
} from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { ActivitySlot, QuestSlot } from "@/app/[communityId]/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/[communityId]/reservation/confirm/hooks/useTicketCounter";
import { ReservationWallet } from "@/app/[communityId]/reservation/confirm/presenters/presentReservationConfirm";
import { ApolloError } from "@apollo/client";
import { logger } from "@/lib/logging";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

const getSelectedTicketIds = (
  wallet: ReservationWallet | null,
  selectedTickets: { [ticketId: string]: number } | undefined,
): string[] => {
  if (!selectedTickets || !wallet) return [];
  
  const ticketIds: string[] = [];
  const allTickets = wallet.tickets;
  
  Object.entries(selectedTickets).forEach(([utilityId, count]) => {
    const availableTickets = allTickets.filter(ticket => 
      ticket.utility?.id === utilityId && ticket.status === "AVAILABLE"
    );
    
    for (let i = 0; i < count && i < availableTickets.length; i++) {
      ticketIds.push(availableTickets[i].id);
    }
  });
  
  return ticketIds;
};

type Result =
  | { success: true; reservation: GqlReservation }
  | { success: false; code: GqlErrorCode };

interface ReservationParams {
  opportunity: ActivityDetail | QuestDetail | null;
  selectedSlot: ActivitySlot | QuestSlot | null;
  wallet: ReservationWallet | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  participantCount: number;
  useTickets: boolean;
  usePoints: boolean;
  selectedPointCount: number;
  selectedTicketCount: number;
  selectedTickets?: { [ticketId: string]: number };
  comment?: string;
  userWallet: number | null;
}

export const useReservationCommand = () => {
  const [createReservation, { loading }] = useCreateReservationMutation();

  const handleReservation = useCallback(
    async ({
      opportunity,
      selectedSlot,
      wallet,
      user,
      ticketCounter,
      useTickets,
      comment,
      participantCount,
      usePoints,
      selectedPointCount,
      selectedTicketCount,
      selectedTickets,
      userWallet
    }: ReservationParams): Promise<Result> => {
      if (loading) return { success: false, code: GqlErrorCode.Unknown };
      if (!user) return { success: false, code: GqlErrorCode.Unauthenticated };
      if (!opportunity || !selectedSlot)
        return { success: false, code: GqlErrorCode.ValidationError };

      const feeRequired = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
      const pointsRequired = 'pointsRequired' in opportunity ? opportunity.pointsRequired : 0;
      const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);
      
      if (isPointsOnly) {
        const totalPointsRequired = pointsRequired * participantCount;
        if (typeof userWallet !== 'number' || userWallet < totalPointsRequired) {
          return { success: false, code: GqlErrorCode.ValidationError };
        }
      }

      const count = selectedTicketCount;
      const ticketIds = useTickets ? getSelectedTicketIds(wallet, selectedTickets) : [];
      if (useTickets && ticketIds.length < count) {
        return { success: false, code: GqlErrorCode.TicketParticipantMismatch };
      }
      try {
        const res = await createReservation({
          variables: {
            input: {
              opportunitySlotId: selectedSlot.id,
              totalParticipantCount: participantCount,
              paymentMethod: useTickets ? "TICKET" : "FEE",
              ticketIdsIfNeed: useTickets ? ticketIds : undefined,
              comment: comment ?? undefined,
              participantCountWithPoint: isPointsOnly ? participantCount : (usePoints ? selectedPointCount : undefined),
            },
          },
        });

        const data = res.data?.reservationCreate;
        if (data?.__typename === "ReservationCreateSuccess") {
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
        logger.warn("Reservation mutation failed", {
          error: e instanceof Error ? e.message : String(e),
          component: "useReservationAction"
        });
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
