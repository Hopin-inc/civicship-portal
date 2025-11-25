"use client";

import React from "react";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";
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
    <section className="px-4 pt-6 pb-8 mt-0">
      <h2 className="text-display-md text-foreground mb-4">{header}</h2>
      <div className="flex flex-col gap-4">
        {formattedOpportunities.map((opportunity) => (
          <OpportunityHorizontalCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </section>
  );
};
