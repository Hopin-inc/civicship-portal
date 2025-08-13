import { getLink, selectBadge } from ".";
import { ActivityCard, QuestCard, FormattedOpportunityCard } from "../types";

export const formatOpportunities = (opportunity: ActivityCard | QuestCard): FormattedOpportunityCard => {
    return {
      ...opportunity,
      href: getLink(opportunity.id, opportunity.communityId, opportunity.category),
      price: "feeRequired" in opportunity ? opportunity.feeRequired?.toLocaleString() :undefined,
      badge: selectBadge(opportunity.hasReservableTicket, opportunity.pointsRequired) ?? undefined,
      image: opportunity.images?.[0],
      pointsToEarn: "pointsToEarn" in opportunity ? opportunity.pointsToEarn?.toLocaleString() ?? undefined : undefined,
    };
  };