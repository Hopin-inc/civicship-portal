'use client';

import React from 'react';
import OpportunityCard, { OpportunityCardProps } from '../opportunity/OpportunityCard';

interface RecommendedOpportunitiesProps {
  opportunities: OpportunityCardProps[];
}

/**
 * Component to display recommended opportunities
 */
export const RecommendedOpportunities: React.FC<RecommendedOpportunitiesProps> = ({ 
  opportunities 
}) => {
  if (opportunities.length === 0) return null;
  
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">おすすめの体験</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {opportunities.map((props: OpportunityCardProps) => (
          <OpportunityCard key={props.id} {...props} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedOpportunities;
