import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import ActivitiesFeaturedSliderWrapper from "./FeaturedSlideWrapper";
import OpportunityImageSSR from "../activities/components/FeaturedSection/ImageSSR";
import HeroHeader from "../activities/components/FeaturedSection/HeroHeader";

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
    <section className="relative h-[70vh] w-full overflow-hidden mb-12 mt-0">
      <HeroHeader />
      <OpportunityImageSSR image={firstImage} title={firstTitle} />
      <ActivitiesFeaturedSliderWrapper opportunities={opportunities} />
    </section>
  );
}
