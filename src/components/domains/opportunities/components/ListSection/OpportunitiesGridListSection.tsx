"use client";

import React from "react";
import { FormattedOpportunityCard } from "@/components/domains/opportunities/types";
import OpportunitiesListSectionSkeleton from "@/components/domains/opportunities/components/ListSection/OpportunityListSectionSkeleton";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { CardGrid } from "@/components/shared/CardGrid";

interface OpportunitiesGridListSectionProps {
  opportunities: FormattedOpportunityCard[];
  isSectionLoading: boolean;
  isInitialLoading?: boolean;
  isTitle?: boolean;
  opportunityTitle: string;
}

const OpportunitiesGridListSection: React.FC<OpportunitiesGridListSectionProps> = ({
  opportunities,
  isInitialLoading,
  isSectionLoading,
  isTitle = true,
  opportunityTitle,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton title={opportunityTitle} />;
  if (opportunities.length === 0) return null;

  return (
    <section className="mt-6 px-6">
      {isTitle && <h2 className="text-display-md">{opportunityTitle}</h2>}
      <CardGrid>
        {opportunities.map((opportunity) => (
          <OpportunityVerticalCard 
            key={opportunity.id}
            {...opportunity}
          />
        ))}
      </CardGrid>
      <div className="h-10" aria-hidden="true"></div>
      {isSectionLoading && (
        <div className="py-6 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
        </div>
      )}
    </section>
  );
};

export default OpportunitiesGridListSection;
