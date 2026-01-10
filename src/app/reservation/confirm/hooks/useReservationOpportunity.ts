"use client";

import { useEffect, useMemo } from "react";
import { GqlOpportunityCategory, useGetOpportunityQuery } from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { presentReservationActivity, presentReservationQuest } from "../presenters/presentReservationConfirm";
import { findSlotById, parseSlotDateRange } from "../utils/slotUtils";
import type { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { logger } from "@/lib/logging";

export const useReservationOpportunity = ({
  opportunityId,
  slotId,
}: {
  opportunityId: string;
  slotId: string;
}) => {
  const { communityId } = useCommunityConfig();
  
  const {
    data,
    loading,
    error,
    refetch,
  } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId },
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

  const selectedSlot = useMemo(() => {
    if (!opportunity) return null;
    return findSlotById(opportunity.slots, slotId);
  }, [opportunity, slotId]);

  const { startDateTime, endDateTime } = useMemo(
    () => parseSlotDateRange(selectedSlot),
    [selectedSlot]
  );

  useEffect(() => {
    if (error)
      logger.warn("Opportunity query error", {
        error: error.message || String(error),
        component: "useReservationOpportunity",
        opportunityId,
      });
  }, [error, opportunityId]);

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    loading,
    error,
    refetch,
  };
};
