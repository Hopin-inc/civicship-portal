"use client";

import { useMemo } from "react";
import { GqlOpportunityCategory, GqlWallet, GqlWalletType, useGetUserWalletQuery } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSlotDateRange } from "@/app/reservation/confirm/hooks/useSlotDateRange";
import { parseBigIntToNumber } from "@/utils/bigint";

export function useSlotAndTicketInfo(
  opportunity: ActivityDetail | QuestDetail | null,
  userId?: string,
  slotId?: string,
  // NOTE:
  // 本フックではユーザーのウォレット残高とチケット在庫を同時に扱う。
  // 以前は useGetMemberWalletsQuery と useGetUserWalletQuery が重複していたが、
  // BigInt変換・skip対応のため統合。


) {
  const { data, loading, error, refetch } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  const wallets = data?.user?.wallets ?? null;

  const currentPoint = useMemo(() => {
    const memberWallet = wallets?.find(w => w.type === GqlWalletType.Member);
    return parseBigIntToNumber(memberWallet?.currentPointView?.currentPoint);
  }, [wallets]);

  const selectedSlot = useMemo(() => {
    if (!opportunity || !slotId) return null;
    return opportunity.slots.find((slot) => slot.id === slotId) ?? null;
  }, [opportunity, slotId]);

  const isActivity = (opportunity: any): opportunity is ActivityDetail => {
    return opportunity?.category === GqlOpportunityCategory.Activity;
  };

  const availableTickets = useAvailableTickets(opportunity, userId);
  const { startDateTime, endDateTime } = useSlotDateRange(selectedSlot);

  return {
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    wallets,
    currentPoint,
    walletLoading: loading,
    walletError: error,
    walletRefetch: refetch,
  };
}
