import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import { useOpportunityData } from "@/app/reservation/confirm/hooks/useOpportunity";
import { useMemo } from "react";

export const useReservationConfirm = ({
  opportunityId,
  slotId,
  userId,
}: {
  opportunityId: string;
  slotId: string;
  userId: string | undefined;
}) => {
  const { opportunity, loading: oppLoading, error: oppError } = useOpportunityData(opportunityId);
  const { wallets, selectedSlot, availableTickets, startDateTime, endDateTime, walletLoading } =
    useSlotAndTicketInfo(opportunity, userId ?? undefined, slotId);

  return useMemo(() => ({
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets,
    availableTickets,
    loading: oppLoading || walletLoading,
    error: oppError,
  }), [
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets,
    availableTickets,
    oppLoading,
    walletLoading,
    oppError
  ]);
};
