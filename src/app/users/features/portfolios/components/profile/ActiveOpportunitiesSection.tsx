import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";
import { useTranslations } from "next-intl";

type ActiveOpportunitiesSectionProps = {
  opportunities: Array<{
    id: string;
    title: string;
    image?: string;
    href: string;
  }>;
};

export const ActiveOpportunitiesSection = ({ opportunities }: ActiveOpportunitiesSectionProps) => {
  const t = useTranslations();
  if (!opportunities.length) return null;

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <h2 className="text-display-sm font-semibold text-foreground">{t("users.portfolio.header.activeOpportunities")}</h2>
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          {opportunities.length}
        </span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {opportunities.map((opportunity) => (
          <OpportunityHorizontalCard key={opportunity.id} {...opportunity} />
        ))}
      </div>
    </div>
  );
};
