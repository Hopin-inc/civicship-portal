"use client";

import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import OpportunitiesListSectionSkeleton from "@/app/activities/components/ListSection/ListSectionSkeleton";

interface ActivitiesAllSectionProps {
  opportunities: ActivityCard[];
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
      <h2 className="text-display-md">すべての体験</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
      <div className="h-20" aria-hidden="true"></div>
      {isSectionLoading && (
        <div className="py-6 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
        </div>
      )}
    </section>
  );
};

export default ActivitiesListSection;
