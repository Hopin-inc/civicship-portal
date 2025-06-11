import { fetchFeaturedAndCarousel } from "./data/fetchActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import ActivitiesPageClient from "@/app/activities/components/ActivitiesPageClient";

export default async function ActivitiesPage() {
  const { featuredCards, upcomingCards, loading } = await fetchFeaturedAndCarousel();
  return (
    <>
      <div className="min-h-screen">
        <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
        <ActivitiesCarouselSection
          title="もうすぐ開催予定"
          opportunities={upcomingCards}
          isInitialLoading={loading}
        />
        <ActivitiesPageClient />
      </div>
    </>
  );
}
