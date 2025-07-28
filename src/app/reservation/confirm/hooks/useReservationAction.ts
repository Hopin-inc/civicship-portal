import { useCallback } from "react";
import {
  GqlErrorCode,
  GqlReservation,
  GqlUser,
  GqlWallet,
  useCreateReservationMutation,
} from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { ApolloError } from "@apollo/client";
import { logger } from "@/lib/logging";
import { getCommunityIdFromEnv } from "@/lib/communities/metadata";

// 選択されたチケットからチケットIDを取得する関数
const getSelectedTicketIds = (
  wallets: GqlWallet[] | null,
  selectedTickets: { [ticketId: string]: number } | undefined,
): string[] => {
  if (!selectedTickets || !wallets) return [];
  
  const ticketIds: string[] = [];
  const allTickets = wallets
    .find(w => w.community?.id === getCommunityIdFromEnv())
    ?.tickets || [];
  
  Object.entries(selectedTickets).forEach(([utilityId, count]) => {
    // 同じutilityに属するチケットから指定された枚数分を取得
    const availableTickets = allTickets.filter(ticket => 
      ticket.utility?.id === utilityId && ticket.status === "AVAILABLE"
    );
    
    // 指定された枚数分のチケットIDを追加
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
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  participantCount: number;
  useTickets: boolean;
  usePoints: boolean;
  selectedPointCount: number;
  selectedTicketCount: number;
  selectedTickets?: { [ticketId: string]: number };
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
      usePoints,
      selectedPointCount,
      selectedTicketCount,
      selectedTickets
    }: ReservationParams): Promise<Result> => {
      if (loading) return { success: false, code: GqlErrorCode.Unknown };
      if (!user) return { success: false, code: GqlErrorCode.Unauthenticated };
      if (!opportunity || !selectedSlot)
        return { success: false, code: GqlErrorCode.ValidationError };

      const count = selectedTicketCount;
      const ticketIds = useTickets ? getSelectedTicketIds(wallets, selectedTickets) : [];
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
              participantCountWithPoint: usePoints ? selectedPointCount : undefined,
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
        logger.error("Reservation mutation failed", {
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
