"use client";

import React from "react";
import { ActivityCard } from "@/app/opportunities/data/type";
import OpportunityCardVertical from "@/app/opportunities/components/Card/CardVertical";

interface PlaceOpportunitiesProps {
  opportunities: ActivityCard[];
}

const PlaceOpportunities: React.FC<PlaceOpportunitiesProps> = ({ opportunities }) => {
  if (!opportunities.length) return null;

  return (
    <div className="px-4 pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-display-sm font-semibold text-foreground flex items-center gap-2">
          募集中の関わり
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            {opportunities.length}
          </span>
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} isCarousel />
        ))}
      </div>
    </div>
  );
};

export default PlaceOpportunities;
