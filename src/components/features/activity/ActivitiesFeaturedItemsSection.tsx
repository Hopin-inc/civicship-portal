'use client';

import React from 'react';
import OpportunityCard from "@/components/features/opportunity/OpportunityCard";
import { ActivityCard } from "@/types/opportunity";

interface ActivitiesFeaturedItemsSectionProps {
  opportunities: ActivityCard[];
}

const ActivitiesFeaturedItemsSection: React.FC<ActivitiesFeaturedItemsSectionProps> = ({
  opportunities
}) => {
  return (
    <section className="mt-6 px-6">
      <h2 className="text-display-md">特集</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesFeaturedItemsSection;
