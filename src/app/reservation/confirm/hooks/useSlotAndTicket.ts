"use client";

import { useMemo } from "react";
import { GqlWallet, useGetUserWalletQuery } from "@/types/graphql";
import { OpportunityDetail } from "@/app/opportunities/data/type";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSlotDateRange } from "@/app/reservation/confirm/hooks/useSlotDateRange";

export function useSlotAndTicketInfo(
  opportunity: OpportunityDetail | null,
  userId?: string,
  slotId?: string,
) {
  // --- Wallet取得（元: useReservationConfirmQuery）---
  const { data, loading, error, refetch } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  const wallets: GqlWallet[] | null = data?.user?.wallets ?? null;

  // --- Slot抽出 ---
  const selectedSlot = useMemo(() => {
    if (!opportunity || !slotId) return null;
    return opportunity.slots.find((slot) => slot.id === slotId) ?? null;
  }, [opportunity, slotId]);

  // --- チケットと日付情報 ---
  const availableTickets = useAvailableTickets(opportunity, userId);
  const { startDateTime, endDateTime } = useSlotDateRange(selectedSlot);

  return {
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    wallets,
    walletLoading: loading,
    walletError: error,
    walletRefetch: refetch,
  };
}
