"use client";

import { useEffect, useMemo } from "react";
import { GqlOpportunityCategory, useGetOpportunityQuery, useGetUserWalletQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presentReservationActivity, presentReservationQuest, presentReservationWallet } from "../presenters/presentReservationConfirm";
import { findSlotById, parseSlotDateRange } from "../utils/slotUtils";
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
      return presentReservationActivity(data.opportunity);
    }
    if (data?.opportunity?.category === GqlOpportunityCategory.Quest) {
      return presentReservationQuest(data.opportunity);
    }
    return null;
  }, [data]);

  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: walletRefetch,
  } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  const wallet = useMemo(
    () => {
      const wallets = walletData?.user?.wallets;
      if (!wallets || !Array.isArray(wallets)) return null;
      return presentReservationWallet(wallets, opportunity);
    },
    [walletData?.user?.wallets, opportunity]
  );

  const selectedSlot = useMemo(() => {
    if (!opportunity) return null;
    return findSlotById(opportunity.slots, slotId);
  }, [opportunity, slotId]);

  const { startDateTime, endDateTime } = useMemo(
    () => parseSlotDateRange(selectedSlot),
    [selectedSlot]
  );

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
    wallet,
    loading,
    hasError,
    triggerRefetch: () => {
      void oppRefetch();
      void walletRefetch();
    },
  };
};
