"use client";

import React from "react";
import OpportunityCardVertical from "../Card/CardVertical";
import { OpportunityCard } from "../../data/type";
import OpportunitiesListSectionSkeleton from "./ListSectionSkeleton";

interface ActivitiesAllSectionProps {
  opportunities: OpportunityCard[];
  isSectionLoading: boolean;
  isInitialLoading?: boolean;
}

const ActivitiesListSection: React.FC<ActivitiesAllSectionProps> = ({
  opportunities,
  isInitialLoading,
  isSectionLoading,
}) => {
  if (isInitialLoading) return <OpportunitiesListSectionSkeleton />;
  if (opportunities.length === 0) return null;

  return (
    <section className="mt-6 px-6">
      <h2 className="text-display-md">すべてのクエスト</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
      <div className="h-20" aria-hidden="true"></div>
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
