import { ActivityCard } from "@/app/activities/data/type";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import HeroHeader from "@/app/activities/components/FeaturedSection/HeroHeader";
import ActivitiesFeaturedSlider from "@/app/activities/components/FeaturedSection/FeaturedSlider";

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

  return (
    <section className="relative h-[70vh] w-full overflow-hidden mb-12">
      <HeroHeader />
      <ActivitiesFeaturedSlider opportunities={opportunities} />
    </section>
  );
}
