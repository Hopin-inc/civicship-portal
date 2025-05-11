'use client';

import React from 'react';
import OpportunityCard from "@/components/features/opportunity/OpportunityCard";
import { ActivityCard } from "@/types/opportunity";

interface ActivitiesAllSectionProps {
  opportunities: ActivityCard[];
  loadMoreRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
}

const ActivitiesAllSection: React.FC<ActivitiesAllSectionProps> = ({ 
  opportunities,
  loadMoreRef,
  isLoading
}) => {
  return (
    <section className="mt-8 px-4 pb-8">
      <h2 className="text-xl font-bold">すべての体験</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard 
            key={opportunity.id}
            {...opportunity}
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>}
      </div>
    </section>
  );
};

export default ActivitiesAllSection;
