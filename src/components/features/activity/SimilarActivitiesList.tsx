import OpportunityCard from "../opportunity/OpportunityCard";
import React from "react";
import { ActivityCard } from "@/types/opportunity";
import { COMMUNITY_ID } from "@/utils";

interface SimilarActivitiesListProps {
  opportunities: ActivityCard[];
  currentOpportunityId: string;
}

export const SimilarActivitiesList: React.FC<SimilarActivitiesListProps> = ({
  opportunities,
  currentOpportunityId,
}) => {
  const filteredOpportunities = opportunities.filter(
    (opportunity) => opportunity.id !== currentOpportunityId
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
              <OpportunityCard
                id={opportunity.id}
                title={opportunity.title}
                category={opportunity.category}
                feeRequired={opportunity.feeRequired || 0}
                location={opportunity.location || "要確認"}
                images={opportunity.images || null}
                communityId={COMMUNITY_ID}
                hasReservableTicket={opportunity.hasReservableTicket}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 