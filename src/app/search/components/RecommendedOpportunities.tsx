"use client";

import React from "react";
import OpportunityCardVertical from "../../activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";

interface RecommendedOpportunitiesProps {
  opportunities: ActivityCard[];
}

export const RecommendedOpportunities: React.FC<RecommendedOpportunitiesProps> = ({
  opportunities,
}) => {
  if (opportunities.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">おすすめの体験</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {opportunities.map((props) => (
          <OpportunityCardVertical key={props.id} opportunity={props} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedOpportunities;
