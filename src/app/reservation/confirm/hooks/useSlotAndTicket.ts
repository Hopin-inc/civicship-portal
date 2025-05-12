import { ActivityDetail } from "@/app/activities/data/type";
import { useReservationConfirmQuery } from "@/app/reservation/hooks/useReservationConfirmQuery";
import { useMemo } from "react";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSlotDateRange } from "@/app/reservation/confirm/hooks/useSlotDateRange";

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
