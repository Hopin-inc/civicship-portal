'use client';

import React from 'react';
import OpportunityCard, { OpportunityCardProps } from '../opportunity/OpportunityCard';

interface ActivitiesUpcomingSectionProps {
  opportunities: OpportunityCardProps[];
}

const ActivitiesUpcomingSection: React.FC<ActivitiesUpcomingSectionProps> = ({ 
  opportunities 
}) => {
  return (
    <section className="mt-8 px-4">
      <h2 className="text-xl font-bold">もうすぐ開催</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCard 
            key={opportunity.id}
            {...opportunity}
          />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesUpcomingSection;
