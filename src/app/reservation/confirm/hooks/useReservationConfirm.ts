"use client";

import { useMemo } from "react";
import { useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { presenterActivityDetail } from "@/app/activities/data/presenter";
import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import type { ActivityDetail } from "@/app/activities/data/type";

export const useReservationConfirm = ({
  opportunityId,
  slotId,
  userId,
}: {
  opportunityId: string;
  slotId: string;
  userId?: string;
}) => {
  // --- Opportunity クエリ ---
  const {
    data,
    loading: oppLoading,
    error: oppError,
    refetch: oppRefetch,
  } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !opportunityId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (err) => console.error("Opportunity query error:", err),
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data]);

  // --- Slot, Wallet, Ticket 情報取得 ---
  const {
    wallets,
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    walletLoading,
    walletError,
    walletRefetch,
  } = useSlotAndTicketInfo(opportunity, userId, slotId);

  // --- 統合された状態管理 ---
  const loading = oppLoading || walletLoading;
  const error = oppError ?? walletError ?? null;

  const refetch = async () => {
    await Promise.all([oppRefetch(), walletRefetch()]);
  };

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets,
    availableTickets,
    loading,
    error,
    refetch,
  };
};
