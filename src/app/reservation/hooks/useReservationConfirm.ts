"use client";

import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import { useOpportunityData } from "@/app/reservation/confirm/hooks/useOpportunity";

export const useReservationConfirm = ({
  opportunityId,
  slotId,
  userId,
}: {
  opportunityId: string;
  slotId: string;
  userId?: string;
}) => {
  const { opportunity, loading: oppLoading, error: oppError } = useOpportunityData(opportunityId);

  const { wallets, selectedSlot, availableTickets, startDateTime, endDateTime, walletLoading } =
    useSlotAndTicketInfo(opportunity, userId, slotId);

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets,
    availableTickets,
    loading: oppLoading || walletLoading,
    error: oppError,
  };
};
