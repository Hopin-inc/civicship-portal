import React from "react";
import { ActivityCard } from "@/app/activities/data/type";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";

interface SimilarActivitiesListProps {
  opportunities: ActivityCard[];
  currentOpportunityId: string;
}

export const SimilarActivitiesList: React.FC<SimilarActivitiesListProps> = ({
  opportunities,
  currentOpportunityId,
}) => {
  const filteredOpportunities = opportunities.filter(
    (opportunity) => opportunity.id !== currentOpportunityId,
  );

  if (filteredOpportunities.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">似ている体験</h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-4 -mx-4">
          {filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="flex-shrink-0 first:ml-0">
              <OpportunityCardVertical opportunity={opportunity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
