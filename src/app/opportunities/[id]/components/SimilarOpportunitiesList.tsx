"use client";

import React from "react";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

interface SimilarOpportunitiesProps {
  header: string;
  opportunities: ActivityCard[] | QuestCard[];
  currentOpportunityId: string;
}

export const SimilarOpportunities: React.FC<SimilarOpportunitiesProps> = ({
  header,
  opportunities,
  currentOpportunityId,
}) => {
  const filteredOpportunities = opportunities.filter(
    (opportunity) => opportunity.id !== currentOpportunityId,
  );
  if (filteredOpportunities.length === 0) return null;
  const formattedOpportunities = filteredOpportunities.map(formatOpportunities)
  return (
    <section className="pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">{header}</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {formattedOpportunities.map((opportunity) => (
          <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </section>
  );
};