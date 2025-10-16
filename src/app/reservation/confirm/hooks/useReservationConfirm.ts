"use client";

import { useEffect, useMemo } from "react";
import { GqlGetOpportunityQuery, GqlOpportunityCategory, useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";
import { useSlotAndTicketInfo } from "@/app/reservation/confirm/hooks/useSlotAndTicket";
import { useWalletData } from "@/app/reservation/confirm/hooks/useWalletData";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import type { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
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

  const walletData = useWalletData(userId);

  const slotInfo = useSlotAndTicketInfo(opportunity, slotId, walletData);

  const availableTickets = useAvailableTickets(opportunity, walletData.tickets);

  const loading = oppLoading || walletData.loading;
  const hasError = Boolean(oppError || walletData.error);

  useEffect(() => {
    if (oppError)
      logger.info("Opportunity query error", {
        error: oppError.message || String(oppError),
        component: "useReservationConfirm",
        opportunityId,
      });
    if (walletData.error)
      logger.info("Slot/Wallet error", {
        error: walletData.error.message || String(walletData.error),
        component: "useReservationConfirm",
        slotId,
      });
  }, [oppError, walletData.error, opportunityId, slotId]);

  return {
    opportunity,
    selectedSlot: slotInfo.selectedSlot,
    startDateTime: slotInfo.startDateTime,
    endDateTime: slotInfo.endDateTime,
    wallets: slotInfo.wallets,
    availableTickets,
    currentPoint: slotInfo.currentPoint,
    loading,
    hasError,
    triggerRefetch: () => {
      void oppRefetch();
      void walletData.refetch();
    },
  };
};
