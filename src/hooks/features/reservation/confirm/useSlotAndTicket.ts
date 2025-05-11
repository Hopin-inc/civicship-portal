import { ActivityDetail } from "@/types/opportunity";
import { useReservationConfirmQuery } from "@/hooks/features/reservation/useReservationConfirmQuery";
import { useMemo } from "react";
import { useAvailableTickets } from "@/hooks/features/ticket/useAvailableTickets";
import { useSlotDateRange } from "@/hooks/features/reservation/confirm/useSlotDateRange";

export function useSlotAndTicketInfo(
  opportunity: ActivityDetail | null,
  userId?: string,
  slotId?: string,
) {
  const { wallets, walletLoading, walletError } = useReservationConfirmQuery(userId);

  const selectedSlot = useMemo(() => {
    if (!opportunity || !slotId) return null;
    return opportunity.slots.find((slot) => slot.id === slotId) ?? null;
  }, [opportunity, slotId]);

  const availableTickets = useAvailableTickets(opportunity, userId);
  const { startDateTime, endDateTime } = useSlotDateRange(selectedSlot);

  return {
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    wallets,
    walletLoading,
    walletError,
  };
}
