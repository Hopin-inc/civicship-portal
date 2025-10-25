import OpportunityVerticalCard from "@/components/domains/opportunities/components/OpportunityVerticalCard";

type ActiveOpportunitiesSectionProps = {
  opportunities: Array<{
    id: string;
    title: string;
    image?: string;
    href: string;
  }>;
};

export const ActiveOpportunitiesSection = ({ opportunities }: ActiveOpportunitiesSectionProps) => {
  if (!opportunities.length) return null;

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h2 className="text-display-sm font-semibold text-foreground py-4">現在募集中の関わり</h2>
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {opportunities.length}
        </span>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4">
            {opportunities.map((opportunity) => (
              <OpportunityVerticalCard key={opportunity.id} {...opportunity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
