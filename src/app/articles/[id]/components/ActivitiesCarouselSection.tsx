"use client";

import React from "react";
import { ActivityCard } from "@/components/domains/opportunities/types";
import OpportunitiesListSectionSkeleton from "@/components/domains/opportunities/components/ListSection/OpportunityListSectionSkeleton";
import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";
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
    <section className="px-4 mt-0 pt-6">
      <h2 className="text-display-md">{title}</h2>
      <div className="flex flex-col gap-4 mt-4">
        {formattedOpportunities.map((opportunity) => (
          <OpportunityHorizontalCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </section>
  );
};
