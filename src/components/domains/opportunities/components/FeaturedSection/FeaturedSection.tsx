import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import FeaturedSectionSkeleton from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunityImageSSR from "@/components/domains/opportunities/components/FeaturedSection/ImageSSR";
import OpportunityHorizontalCard from "@/components/domains/opportunities/components/OpportunityHorizontalCard";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

interface Props {
  opportunities: (ActivityCard | QuestCard)[];
  isInitialLoading?: boolean;
}

export default function FeaturedSection({ opportunities, isInitialLoading = false }: Props) {
  if (isInitialLoading) return <FeaturedSectionSkeleton />;
  if (opportunities.length === 0) return null;

  const firstImage = opportunities[0]?.images?.[1] ?? "";
  const firstTitle = opportunities[0]?.title ?? "";
  const formattedOpportunities = opportunities.map(formatOpportunities);

  return (
    <section className="w-full">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <OpportunityImageSSR image={firstImage} title={firstTitle} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>
      <div className="px-4 -mt-16 relative z-10">
        <h2 className="text-display-md text-white mb-4">注目の体験</h2>
        <div className="flex flex-col gap-4">
          {formattedOpportunities.map((opportunity, index) => (
            <OpportunityHorizontalCard
              key={`${opportunity.id}_${index}`}
              {...opportunity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
