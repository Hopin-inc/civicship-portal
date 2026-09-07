import { useCallback } from "react";
import {
  GqlErrorCode,
  GqlReservation,
  GqlUser,
  useCreateReservationMutation,
} from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { ActivitySlot, QuestSlot } from "@/app/community/[communityId]/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/community/[communityId]/reservation/confirm/hooks/useTicketCounter";
import { ReservationWallet } from "@/app/community/[communityId]/reservation/confirm/presenters/presentReservationConfirm";
import { ApolloError } from "@apollo/client";
import { logger } from "@/lib/logging";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

/**
 * 選択された枚数を、API へ渡すチケット個々の id に展開する。
 *
 * 画面のチケット一覧は utility 単位でまとめられていて、その `id` は utility の id
 * である。API が求めるのはチケットの id なので、まとまりが持っている実体の id を
 * 使う。ここで `wallet.tickets` を生のチケット配列と見なして要素の `id` を積むと、
 * utility の id が ticketIdsIfNeed として送られ、API 側が該当するチケットを引けずに
 * 予約ごと失敗する。
 *
 * 引数のキーは `TicketsToggle` が数えている単位、つまりまとまりの id。
 */
const getSelectedTicketIds = (
  wallet: ReservationWallet | null,
  selectedTickets: { [groupId: string]: number } | undefined,
): string[] => {
  if (!selectedTickets || !wallet) return [];

  return Object.entries(selectedTickets).flatMap(([groupId, count]) => {
    const group = wallet.tickets.find((t) => t.id === groupId);
    return group ? group.ticketIds.slice(0, count) : [];
  });
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
