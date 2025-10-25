import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

interface UserOpportunitiesSectionProps {
  opportunities: Array<{
    id: string;
    title: string;
    coverUrl?: string;
    category: string;
  }>;
}

export function UserOpportunitiesSection({ opportunities }: UserOpportunitiesSectionProps) {
  const formattedOpportunities = opportunities.map((opp) =>
    formatOpportunities({
      id: opp.id,
      title: opp.title,
      images: opp.coverUrl ? [opp.coverUrl] : [],
      category: opp.category,
    })
  );

  return (
    <section className="py-6 mt-0">
      <h2 className="text-display-sm font-semibold text-foreground pt-4 pb-1">
        主催中の体験
      </h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {formattedOpportunities.map((opportunity) => (
          <OpportunityVerticalCard
            key={opportunity.id}
            {...opportunity}
          />
        ))}
      </div>
    </section>
  );
}
