import { useAuth } from "@/contexts/AuthContext";
import { useSlotAndTicketInfo } from "@/hooks/features/reservation/confirm/useSlotAndTicket";
import { useTicketCounter } from "@/hooks/features/reservation/confirm/useTicketCounter";
import { useOpportunityData } from "@/hooks/features/reservation/confirm/useOpportunity";
import { useHeader } from "@/contexts/HeaderContext";
import { useEffect } from "react";
import { useLoading } from "@/hooks";
import { useReservationActions } from "@/hooks/features/reservation/confirm/useReservationAction";

export type ReservationParams = {
  id: string | null;
  starts_at: string | null;
  guests: string | null;
  community_id: string | null;
  slot_id?: string | null;
};

export const useReservationConfirm = (params: ReservationParams) => {
  const opportunityId = params.id ?? "";
  const slotId = params.slot_id ?? "";
  const participantCount = parseInt(params.guests ?? "1", 10);
  const { user } = useAuth();

  const { opportunity, loading: oppLoading, error: oppError } = useOpportunityData(opportunityId);
  const { wallets, selectedSlot, availableTickets, startDateTime, endDateTime, walletLoading } =
    useSlotAndTicketInfo(opportunity, user?.id, slotId);

  const ticketCounter = useTicketCounter(availableTickets);
  const actions = useReservationActions({
    opportunity,
    selectedSlot,
    wallets,
    user,
    ticketCounter,
  });

  const { updateConfig } = useHeader();
  useEffect(() => {
    updateConfig({
      title: "申し込み内容の確認",
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  const { setIsLoading } = useLoading();
  useEffect(() => {
    setIsLoading(oppLoading || walletLoading);
  }, [oppLoading, walletLoading, setIsLoading]);

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    participantCount,
    pricePerPerson: opportunity?.feeRequired ?? 0,
    ticketCount: ticketCounter.count,
    incrementTicket: ticketCounter.increment,
    decrementTicket: ticketCounter.decrement,
    availableTickets,
    ...actions,
    loading: oppLoading || walletLoading,
    error: oppError,
  };
};
