"use client";

import React from "react";
import { FormattedOpportunityCard } from "@/components/domains/opportunities/types";
import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";
import OpportunitiesListSectionSkeleton from "./OpportunityListSectionSkeleton";

interface OpportunityCarouselListSectionProps {
  title: string;
  opportunities: FormattedOpportunityCard[];
  isInitialLoading?: boolean;
  isSearchResult?: boolean;
}

export const OpportunityCarouselListSection: React.FC<OpportunityCarouselListSectionProps> = ({
  title,
  opportunities,
  isInitialLoading = false,
  isSearchResult = false,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton title={title} />;
  if (opportunities.length === 0) return null;

  const match = isSearchResult ? title.match(/^(\d+)\/(\d+)\((.+)\)$/) : null;
  const [month, day, weekday] = match ? match.slice(1) : [];

  return (
    <section className="px-4 mt-6">
      {isSearchResult ? (
        <h2 className="flex items-baseline gap-1">
          <span className="text-md text-gray-500">{month}/</span>
          <span className="text-display-xl">{day}</span>
          <span className="text-sm text-gray-500">（{weekday}）</span>
        </h2>
      ) : (
        <h2 className="text-display-md">{title}</h2>
      )}
      <div className="flex flex-col gap-4 mt-4">
        {opportunities.map((opportunity, index) => (
          <OpportunityHorizontalCard
            key={`${opportunity.id}_${index}`}
            {...opportunity}
          />
        ))}
      </div>
    </section>
  );
};

