"use client";

import { useEffect, useMemo } from "react";
import { GqlGetOpportunityQuery, GqlOpportunityCategory, useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunity/data/presenter";
import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import type { ActivityDetail, QuestDetail } from "@/components/domains/opportunity/types";
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

  const opportunity: ActivityDetail | QuestDetail | null = useMemo(() => {
    if (data?.opportunity?.category === GqlOpportunityCategory.Activity) {
      return presenterActivityDetail(data.opportunity);
    }
    if (data?.opportunity?.category === GqlOpportunityCategory.Quest) {
      return presenterQuestDetail(data.opportunity);
    }
    return null;
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
    if (oppError)
      logger.info("Opportunity query error", {
        error: oppError.message || String(oppError),
        component: "useReservationConfirm",
        opportunityId,
      });
    if (walletError)
      logger.info("Slot/Wallet error", {
        error: walletError.message || String(walletError),
        component: "useReservationConfirm",
        slotId,
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
