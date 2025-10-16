import { useMemo } from "react";
import { GqlOpportunityCategory } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { AvailableTicket } from "@/app/tickets/hooks/useAvailableTickets";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

interface UseOpportunityCalculationsProps {
  opportunity: ActivityDetail | QuestDetail | null;
  availableTickets: AvailableTicket[];
  participantCount: number;
  userWallet: number | null;
}

interface OpportunityCalculations {
  feeRequired: number | null;
  pointsRequired: number;
  isActivity: boolean;
  isQuest: boolean;
  maxTickets: number;
  isPointsOnly: boolean;
  totalPointsRequired: number;
  hasInsufficientPoints: boolean;
}

export function useOpportunityCalculations({
  opportunity,
  availableTickets,
  participantCount,
  userWallet,
}: UseOpportunityCalculationsProps): OpportunityCalculations {
  return useMemo(() => {
    if (!opportunity) {
      return {
        feeRequired: null,
        pointsRequired: 0,
        isActivity: false,
        isQuest: false,
        maxTickets: 0,
        isPointsOnly: false,
        totalPointsRequired: 0,
        hasInsufficientPoints: false,
      };
    }

    const feeRequired = "feeRequired" in opportunity ? opportunity.feeRequired : null;
    const pointsRequired = "pointsRequired" in opportunity ? opportunity.pointsRequired : 0;
    const isActivity = opportunity.category === GqlOpportunityCategory.Activity;
    const isQuest = opportunity.category === GqlOpportunityCategory.Quest;
    const maxTickets = availableTickets.reduce((sum, ticket) => sum + ticket.count, 0);
    const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);
    const totalPointsRequired = pointsRequired * participantCount;
    const hasInsufficientPoints = isPointsOnly && (userWallet === null || userWallet < totalPointsRequired);

    return {
      feeRequired,
      pointsRequired,
      isActivity,
      isQuest,
      maxTickets,
      isPointsOnly,
      totalPointsRequired,
      hasInsufficientPoints,
    };
  }, [opportunity, availableTickets, participantCount, userWallet]);
}
