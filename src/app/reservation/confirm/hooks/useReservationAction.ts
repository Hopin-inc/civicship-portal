"use client";

import { useReservationUIState } from "./useReservationUIState";
import type { ActivityDetail } from "@/app/activities/data/type";
import type { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import type { GqlUser, GqlWallet } from "@/types/graphql";
import { useReservationSubmission } from "@/app/reservation/confirm/hooks/useReservartionAction";
import { UseTicketCounterReturn } from "@/app/reservation/confirm/hooks/useTicketCounter";

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
  const { useTickets, setUseTickets, isLoginModalOpen, setIsLoginModalOpen } =
    useReservationUIState();

  const { submit, creatingReservation } = useReservationSubmission({
    opportunity,
    selectedSlot,
    wallets,
    user,
    ticketCounter,
    useTickets,
  });

  return {
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleReservation: submit,
    creatingReservation,
  };
};
