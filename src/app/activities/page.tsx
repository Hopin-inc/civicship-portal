import { fetchFeaturedAndCarousel } from "./data/fetchActivities";
import ActivitiesPageClient from "./components/ActivitiesPageClient";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesCarouselSection from "./components/CarouselSection/CarouselSection";

export default async function ActivitiesPage() {
  const { featuredCards, upcomingCards } = await fetchFeaturedAndCarousel();
  return (
    <>
      <div className="min-h-screen">
        <ActivitiesFeaturedSection opportunities={featuredCards} />
        <ActivitiesCarouselSection title="もうすぐ開催予定" opportunities={upcomingCards} />
        <ActivitiesPageClient />
      </div>
    </>
  );
}
