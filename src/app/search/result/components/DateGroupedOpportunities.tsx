"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import { GqlOpportunityCategory } from "@/types/graphql";
import { CarouselSection } from "@/app/components/CarouselSection";

interface DateGroupedOpportunitiesProps {
  groupedOpportunities: Record<string, (ActivityCard | QuestCard)[]>;
}

const DateGroupedOpportunities: React.FC<DateGroupedOpportunitiesProps> = ({
  groupedOpportunities,
}) => {
  if (Object.keys(groupedOpportunities).length === 0) return null;

  const sortedEntries = Object.entries(groupedOpportunities).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
  );

  return (
    <section>
      {sortedEntries.map(([dateKey, opportunities]) => {
        if (opportunities.length === 0) return null;
        const first = opportunities[0];
        if (first.category === GqlOpportunityCategory.Activity) {
          return (
            <CarouselSection
              key={dateKey}
              title={format(new Date(dateKey), "M/d(E)", { locale: ja })}
              opportunities={opportunities as ActivityCard[]}
              isSearchResult={true}
            />
          );
        }
        if (first.category === GqlOpportunityCategory.Quest) {
          return (
            <CarouselSection
              key={dateKey}
              title={format(new Date(dateKey), "M/d(E)", { locale: ja })}
              opportunities={opportunities as QuestCard[]}
              isSearchResult={true}
            />
          );
        }
        return null;
      })}
    </section>
  );
};

export default DateGroupedOpportunities;
