import { ActivityCard } from "@/app/activities/data/type";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import HeroHeader from "@/app/activities/components/FeaturedSection/HeroHeader";
import OpportunityImageSSR from "@/app/activities/components/FeaturedSection/ImageSSR";
import ActivitiesFeaturedSliderWrapper from "@/app/activities/components/FeaturedSection/FeaturedSlideWrapper";

interface Props {
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

export default function ActivitiesFeaturedSection({
  opportunities,
  isInitialLoading = false,
}: Props) {
  if (isInitialLoading) return <FeaturedSectionSkeleton />;
  if (opportunities.length === 0) return null;

  const firstImage = opportunities[0]?.images?.[1] ?? "";
  const firstTitle = opportunities[0]?.title ?? "";

  return (
    <section className="relative h-[70vh] w-full overflow-hidden mb-12 mt-0">
      <HeroHeader />
      <OpportunityImageSSR image={firstImage} title={firstTitle} />
      <ActivitiesFeaturedSliderWrapper opportunities={opportunities} />
    </section>
  );
}
