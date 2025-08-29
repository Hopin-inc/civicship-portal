import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import FeaturedSectionSkeleton from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSectionSkeleton";
import ActivitiesFeaturedSliderWrapper from "@/components/domains/opportunities/components/FeaturedSection/FeaturedSlideWrapper";
import OpportunityImageSSR from "@/components/domains/opportunities/components/FeaturedSection/ImageSSR";
import HeroHeader from "@/components/domains/opportunities/components/FeaturedSection/HeroHeader";

interface Props {
  opportunities: (ActivityCard | QuestCard)[];
  isInitialLoading?: boolean;
}

export default function FeaturedSection({
  opportunities,
  isInitialLoading = false,
}: Props) {
  if (isInitialLoading) return <FeaturedSectionSkeleton />;
  if (opportunities.length === 0) return null;

  const firstImage = opportunities[0]?.images?.[1] ?? "";
  const firstTitle = opportunities[0]?.title ?? "";

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <HeroHeader />
      <OpportunityImageSSR image={firstImage} title={firstTitle} />
      <ActivitiesFeaturedSliderWrapper opportunities={opportunities} />
    </section>
  );
}
