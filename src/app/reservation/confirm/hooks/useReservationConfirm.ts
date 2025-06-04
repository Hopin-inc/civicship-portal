"use client";

import { useEffect, useMemo } from "react";
import { useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { presenterOpportunityDetail } from "@/app/opportunities/data/presenter";
import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import type { OpportunityDetail } from "@/app/opportunities/data/type";
import { logger } from "@/lib/logging";

export const useReservationConfirm = ({
  opportunityId,
  slotId,
  userId,
}: {
  opportunityId: string;
  slotId: string;
  userId?: string;
}) => {
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
  });

  const opportunity: OpportunityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterOpportunityDetail(data.opportunity) : null;
  }, [data]);

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

  const loading = oppLoading || walletLoading;
  const hasError = Boolean(oppError || walletError);

  useEffect(() => {
    if (oppError) logger.info("Opportunity query error", {
      error: oppError.message || String(oppError),
      component: "useReservationConfirm",
      opportunityId
    });
    if (walletError) logger.info("Slot/Wallet error", {
      error: walletError.message || String(walletError),
      component: "useReservationConfirm",
      slotId
    });
  }, [oppError, walletError, opportunityId, slotId]);

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    wallets,
    availableTickets,
    loading,
    hasError, // ← serialize-safe
    triggerRefetch: () => {
      void oppRefetch();
      void walletRefetch();
    },
  };
};
