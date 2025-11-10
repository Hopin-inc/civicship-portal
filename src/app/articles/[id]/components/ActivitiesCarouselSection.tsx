"use client";

import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import OpportunitiesListSectionSkeleton from "@/components/domains/opportunities/components/ListSection/OpportunityListSectionSkeleton";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

interface Props {
  title: string;
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

export const ActivitiesCarouselSection: React.FC<Props> = ({
  title,
  opportunities,
  isInitialLoading = false,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton title={title} />;
  if (opportunities.length === 0) return null;

  const formattedOpportunities = opportunities.map(formatOpportunities);

  return (
    <section className="pl-4 pr-0 mt-0 pt-6">
      <h2 className="text-display-md">{title}</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {formattedOpportunities.map((opportunity) => (
          <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </section>
  );
};
