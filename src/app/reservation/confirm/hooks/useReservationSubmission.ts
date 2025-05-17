"use client";

import { useEffect, useRef } from "react";
import { getTicketIds } from "@/app/reservation/data/presenter/reservation";
import type { GqlUser, GqlWallet } from "@/types/graphql";
import { useCreateReservationMutation } from "@/types/graphql";
import type { ActivityDetail } from "@/app/activities/data/type";
import type { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";

type Result = { success: true; reservationId: string } | { success: false; error: string };

export const useReservationSubmission = ({
  opportunity,
  selectedSlot,
  wallets,
  user,
  ticketCounter,
  useTickets,
}: {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  user: Pick<GqlUser, "id"> | null;
  ticketCounter: UseTicketCounterReturn;
  useTickets: boolean;
}) => {
  const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation();

  const latestParamsRef = useRef({
    opportunity,
    selectedSlot,
    wallets,
    user,
    ticketCounter,
    useTickets,
  });

  // 更新は副作用で明示的に行う
  useEffect(() => {
    latestParamsRef.current = {
      opportunity,
      selectedSlot,
      wallets,
      user,
      ticketCounter,
      useTickets,
    };
  }, [opportunity, selectedSlot, wallets, user, ticketCounter, useTickets]);

  const submit = useRef<() => Promise<Result>>(async () => {
    const { opportunity, selectedSlot, wallets, user, ticketCounter, useTickets } =
      latestParamsRef.current;

    if (!user) return { success: false, error: "NOT_AUTHENTICATED" };
    if (!selectedSlot || !opportunity) return { success: false, error: "MISSING_DATA" };

    const participantCount = ticketCounter.count;

    const ticketIds = useTickets
      ? getTicketIds(wallets, opportunity.requiredTicket, participantCount)
      : [];

    if (useTickets && ticketIds.length < participantCount) {
      return { success: false, error: "NOT_ENOUGH_TICKETS" };
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

      const reservation = result.data?.reservationCreate?.reservation;
      if (reservation) {
        return { success: true, reservationId: reservation.id };
      }

      return { success: false, error: "UNKNOWN_ERROR" };
    } catch (e) {
      console.error("Reservation error:", e);
      return { success: false, error: "UNKNOWN_ERROR" };
    }
  });

  return {
    submit: submit.current,
    creatingReservation,
  };
};
