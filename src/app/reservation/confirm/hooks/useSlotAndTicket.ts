"use client";

import { useMemo } from "react";
import { GqlOpportunityCategory } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { useSlotDateRange } from "@/app/reservation/confirm/hooks/useSlotDateRange";
import type { useWalletData } from "./useWalletData";

export function useSlotAndTicketInfo(
  opportunity: ActivityDetail | QuestDetail | null,
  slotId: string | undefined,
  walletData: ReturnType<typeof useWalletData>
) {
  const selectedSlot = useMemo(() => {
    if (!opportunity || !slotId) return null;
    return opportunity.slots.find((slot) => slot.id === slotId) ?? null;
  }, [opportunity, slotId]);

  const isActivity = (opportunity: any): opportunity is ActivityDetail => {
    return opportunity?.category === GqlOpportunityCategory.Activity;
  };

  const { startDateTime, endDateTime } = useSlotDateRange(selectedSlot);

  return {
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets: walletData.wallets,
    currentPoint: walletData.currentPoint,
    walletLoading: walletData.loading,
    walletError: walletData.error,
    walletRefetch: walletData.refetch,
  };
}
