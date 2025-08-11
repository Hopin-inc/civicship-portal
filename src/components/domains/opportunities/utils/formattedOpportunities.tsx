import { GqlOpportunityCategory } from "@/types/graphql";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import { getLink, selectBadge } from ".";
import { ActivityCard, QuestCard, FormattedOpportunityCard } from "../types";

export const formattedOpportunities = (opportunity: ActivityCard | QuestCard): FormattedOpportunityCard => {
    return {
      ...opportunity,
      href: getLink(opportunity.id, opportunity.communityId, opportunity.category),
      price: opportunity.category === GqlOpportunityCategory.Activity ? "feeRequired" in opportunity ? `${opportunity.feeRequired?.toLocaleString()}円/人~` : undefined : "参加無料",
      priceIcon: opportunity.category === GqlOpportunityCategory.Activity ? <JapaneseYenIcon className="w-4 h-4" /> : undefined,
      locationIcon: <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />,
      badge: selectBadge(opportunity.hasReservableTicket, opportunity.pointsRequired) ?? undefined,
      image: opportunity.images?.[0],
      pointsToEarn: "pointsToEarn" in opportunity ? opportunity.pointsToEarn?.toLocaleString() ?? undefined : undefined,
    };
  };