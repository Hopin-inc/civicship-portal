"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GqlUser, GqlWallet } from "@/types/graphql";
import { useCreateReservationMutation } from "@/types/graphql";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import type { ActivityDetail } from "@/app/activities/data/type";
import type { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import type { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";

type Result = { success: true; reservationId: string } | { success: false; error: string };

export const useReservationActions = ({
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
}) => {
  const [useTickets, setUseTickets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [createReservation, { loading }] = useCreateReservationMutation();

  const latest = useRef({ opportunity, selectedSlot, wallets, user, ticketCounter });
  useEffect(() => {
    latest.current = { opportunity, selectedSlot, wallets, user, ticketCounter };
  }, [opportunity, selectedSlot, wallets, user, ticketCounter]);

  const handleReservation = useCallback(async (): Promise<Result> => {
    const { opportunity, selectedSlot, wallets, user, ticketCounter } = latest.current;

    if (loading) {
      return { success: false, error: "IN_PROGRESS" };
    }
    if (!user) {
      return { success: false, error: "NOT_AUTHENTICATED" };
    }
    if (!opportunity || !selectedSlot) {
      return { success: false, error: "MISSING_DATA" };
    }

    const count = ticketCounter.count;
    const ticketIds = useTickets ? getTicketIds(wallets, opportunity.requiredTicket, count) : [];
    if (useTickets && ticketIds.length < count) {
      return { success: false, error: "NOT_ENOUGH_TICKETS" };
    }

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
    if (reservation) {
      return { success: true, reservationId: reservation.id };
    }

    const rawCode = res.errors?.[0]?.extensions?.code;
    const errCode = typeof rawCode === "string" ? rawCode : "UNKNOWN_ERROR";

    return { success: false, error: errCode };
  }, [createReservation, loading, useTickets]);

  return {
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleReservation,
    creatingReservation: loading,
  };
};
