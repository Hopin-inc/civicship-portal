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
  opportunityTitle: string | null;
  displayDate?: {
    month: string;
    day: string;
    weekday: string;
  };
}

const OpportunitiesGridListSection: React.FC<OpportunitiesGridListSectionProps> = ({
  opportunities,
  isInitialLoading,
  isSectionLoading,
  isTitle = true,
  opportunityTitle,
  displayDate,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton title={opportunityTitle ?? ""} />;
  if (opportunities.length === 0) return null;
  const getTitle = () => {
    if(isTitle && opportunityTitle){
      return <h2 className="text-display-md">{opportunityTitle}</h2>
    }else if(displayDate){
      return(
        <div className="flex items-end">
          <div className="flex items-start">
            <span className="text-label-md text-caption">{displayDate.month}</span>
            <span className="text-label-md text-caption ml-[0.4px]">/</span>
            <span className="text-display-xl font-bold text-foreground leading-none">{displayDate.day}</span>
          </div>
          <span className="text-md text-foreground">({displayDate.weekday})</span>
        </div>
      )
    }else{
      return null;
    }
  }

  return (
    <section className="mt-6 px-6">
      {getTitle()}
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
