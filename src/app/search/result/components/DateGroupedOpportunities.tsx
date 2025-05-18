"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivityCard } from "@/app/activities/data/type";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";

interface DateGroupedOpportunitiesProps {
  groupedOpportunities: Record<string, ActivityCard[]>;
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
      {sortedEntries.map(([dateKey, opportunities]) => (
        <ActivitiesCarouselSection
          key={dateKey}
          title={format(new Date(dateKey), "M/d(E)", { locale: ja })}
          opportunities={opportunities}
          isSearchResult={true}
        />
      ))}
    </section>
  );
};

export default DateGroupedOpportunities;
