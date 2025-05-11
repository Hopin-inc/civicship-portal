'use client';

import { useCreateReservationMutation } from "@/types/graphql";
import { getTicketIds } from "@/presenters/reservation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ActivityDetail } from "@/types/opportunity";
import type { GqlWallet } from "@/types/graphql";
import type { ActivitySlot } from "@/types/opportunitySlot";

type Params = {
  opportunity: ActivityDetail;
  selectedSlot: ActivitySlot;
  participantCount: number;
  wallets: GqlWallet[] | null;
  useTickets: boolean;
};

export const useCreateReservationHandler = () => {
  const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation();
  const router = useRouter();

  const execute = async ({
                           opportunity,
                           selectedSlot,
                           participantCount,
                           wallets,
                           useTickets,
                         }: Params) => {
    if (!opportunity || !selectedSlot) {
      toast.error("必要な情報が不足しています");
      return;
    }

    const ticketIds = useTickets
      ? getTicketIds(wallets, opportunity.requiredTicket, participantCount)
      : [];

    if (useTickets && ticketIds.length < participantCount) {
      toast.error("必要なチケットが不足しています");
      return;
    }

    try {
      const result = await createReservation({
        variables: {
          input: {
            opportunitySlotId: selectedSlot.id,
            totalParticipantCount: participantCount,
            paymentMethod: useTickets ? "TICKET" : "FEE",
            ticketIdsIfNeed: useTickets ? ticketIds : undefined,
          },
        },
      });

      //TODO エラーハンドリングはこれ
      result.errors?.forEach((error) => {})

      const reservation = result.data?.reservationCreate?.reservation;
      if (reservation) {
        toast.success("予約が完了しました");
        router.push(`/reservation/complete?opportunity_id=${opportunity.id}&reservation_id=${reservation.id}`);
      }
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error(
        err instanceof Error ? err.message : "予約に失敗しました。もう一度お試しください。"
      );
    }
  };

  return {
    execute,
    creatingReservation,
  };
};
