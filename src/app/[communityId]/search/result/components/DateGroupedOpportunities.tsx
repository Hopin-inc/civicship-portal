"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import { GqlOpportunityCategory } from "@/types/graphql";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import OpportunitiesGridListSection from "@/components/domains/opportunities/components/ListSection/OpportunitiesGridListSection";

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

  const getDisplayDate = (dateKey: string) => {
    const date = new Date(dateKey);
    return {
      month: format(date, "M", { locale: ja }),
      day: format(date, "d", { locale: ja }),
      weekday: format(date, "E", { locale: ja }),
    }
  }

  return (
    <section>
      {sortedEntries.map(([dateKey, opportunities]) => {
        if (opportunities.length === 0) return null;
        const first = opportunities[0];
        if (first.category === GqlOpportunityCategory.Activity) {
          const formattedOpportunities = opportunities.map(formatOpportunities);
          return (
            <OpportunitiesGridListSection
              key={dateKey}
              opportunityTitle={null}
              opportunities={formattedOpportunities}
              isInitialLoading={false}
              isSectionLoading={false}
              displayDate={getDisplayDate(dateKey)}
            />
          );
        }
        if (first.category === GqlOpportunityCategory.Quest) {
          const formattedOpportunities = opportunities.map(formatOpportunities);
          return (
            <OpportunitiesGridListSection
              key={dateKey}
              opportunityTitle={null}
              opportunities={formattedOpportunities}
              isInitialLoading={false}
              isSectionLoading={false}
              displayDate={getDisplayDate(dateKey)}
            />
          );
        }
        return null;
      })}
    </section>
  );
};

export default DateGroupedOpportunities;
