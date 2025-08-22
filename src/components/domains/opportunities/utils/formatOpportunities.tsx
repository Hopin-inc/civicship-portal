import { getLink, selectBadge } from ".";
import { ActivityCard, QuestCard, FormattedOpportunityCard, isActivityCategory, isQuestCategory } from "../types";

export const formatOpportunities = (opportunity: ActivityCard | QuestCard): FormattedOpportunityCard => {
    return {
      ...opportunity,
      href: getLink(opportunity.id, opportunity.communityId, opportunity.category),
      price: isActivityCategory(opportunity) ? opportunity.feeRequired : null,
      badge: selectBadge(opportunity.hasReservableTicket, opportunity.pointsRequired) ?? undefined,
      image: opportunity.images?.[0],
      pointsToEarn: isQuestCategory(opportunity) ? opportunity.pointsToEarn : null,
    };
  };