"use client";

import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { OpportunityCard } from "@/app/activities/data/type";

interface SameStateActivitiesProps {
  header: string;
  opportunities: OpportunityCard[];
  currentOpportunityId: string;
}

const SameStateActivities: React.FC<SameStateActivitiesProps> = ({
  header,
  opportunities,
  currentOpportunityId,
}) => {
  const filteredOpportunities = opportunities.filter(
    (opportunity) => opportunity.id !== currentOpportunityId,
  );
  if (filteredOpportunities.length === 0) return null;
  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">{header}</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} isCarousel />
        ))}
      </div>
    </section>
  );
};

export default SameStateActivities;
