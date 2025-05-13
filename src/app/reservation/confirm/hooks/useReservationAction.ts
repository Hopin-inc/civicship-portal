"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import { useCreateReservationMutation } from "@/types/graphql";
import type { ActivityDetail } from "@/app/activities/data/type";
import type { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import type { GqlUser, GqlWallet } from "@/types/graphql";
import { useTicketCounter } from "./useTicketCounter";

type UseTicketCounterReturn = ReturnType<typeof useTicketCounter>;

export function useReservationActions({
  opportunity,
  selectedSlot,
  wallets,
  user,
  ticketCounter,
}: {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
}) {
  const router = useRouter();
  const [useTickets, setUseTickets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation();

  const handleConfirmReservation = useCallback(async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!selectedSlot || !opportunity) {
      toast.error("必要な情報が不足しています");
      return;
    }

    const participantCount = ticketCounter.count;

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

      result.errors?.forEach((error) => {
        console.error("GraphQL error:", error.message);
      });

      const reservation = result.data?.reservationCreate?.reservation;
      if (reservation) {
        toast.success("予約が完了しました");
        router.push(
          `/reservation/complete?opportunity_id=${opportunity.id}&reservation_id=${reservation.id}`,
        );
      }
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error(
        err instanceof Error ? err.message : "予約に失敗しました。もう一度お試しください。",
      );
    }
  }, [
    user,
    opportunity,
    selectedSlot,
    ticketCounter.count,
    wallets,
    useTickets,
    createReservation,
    router,
  ]);

  return {
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleConfirmReservation,
    creatingReservation,
  };
}
