"use client";

import React from "react";
import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import OpportunitiesListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";
import OpportunityCard from "@/components/domains/opportunity/components/OpportunityCard";
import { GqlOpportunityCategory } from "@/types/graphql";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import { CardGrid } from "@/components/shared/CardGrid";

interface ActivitiesAllSectionProps {
  opportunities: (ActivityCard | QuestCard)[];
  isSectionLoading: boolean;
  isInitialLoading?: boolean;
  isTitle?: boolean;
}

const selectBadge = (hasReservableTicket: boolean | null, pointsRequired: number | null) => {
  switch (true) {
    case hasReservableTicket && pointsRequired !== null && pointsRequired > 0:
      return "チケット利用可";
    case hasReservableTicket:
      return "チケット利用可";
    case pointsRequired !== null && pointsRequired > 0:
      return "ポイントが使える";
    default:
      return null;
  }
}

const getLink = (id: string, communityId: string, category: GqlOpportunityCategory) => {
  if (category === GqlOpportunityCategory.Activity) {
    return `/activities/${id}?community_id=${communityId}`;
  } else if (category === GqlOpportunityCategory.Quest) {
    return `/quests/${id}?community_id=${communityId}`;
  }
  return "";
}

const ActivitiesListSection: React.FC<ActivitiesAllSectionProps> = ({
  opportunities,
  isInitialLoading,
  isSectionLoading,
  isTitle = true,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton />;
  if (opportunities.length === 0) return null;

  const formatOpportunities = opportunities.map((opportunity) => {
    return {
      ...opportunity,
      href: getLink(opportunity.id, opportunity.communityId, opportunity.category),
      price: opportunity.category === GqlOpportunityCategory.Activity ? "feeRequired" in opportunity ? `${opportunity.feeRequired?.toLocaleString()}円/人~` : undefined : "参加無料",
      priceIcon: opportunity.category === GqlOpportunityCategory.Activity ? <JapaneseYenIcon className="w-4 h-4" /> : undefined,
      locationIcon: <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />,
      badge: selectBadge(opportunity.hasReservableTicket, opportunity.pointsRequired) ?? undefined,
      image: opportunity.images?.[0],
      pointsToEarn: "pointsToEarn" in opportunity ? opportunity.pointsToEarn?.toLocaleString() ?? undefined : undefined,
    }
  })

  return (
    <section className="mt-6 px-6">
      {isTitle && <h2 className="text-display-md">すべての体験</h2>}
      <CardGrid>
        {formatOpportunities.map((formattedOpportunity) => (
          <OpportunityCard 
            key={formattedOpportunity.id}
            {...formattedOpportunity}
          />
        ))}
      </CardGrid>
      <div className="h-10" aria-hidden="true"></div>
      {/*<div ref={loadMoreRef} className="h-10" aria-hidden="true" />*/}
      {isSectionLoading && (
        <div className="py-6 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
        </div>
      )}
    </section>
  );
};

export default ActivitiesListSection;
