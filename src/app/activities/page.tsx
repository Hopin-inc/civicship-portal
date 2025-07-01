import { fetchFeaturedAndCarousel } from "./data/fetchActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import ActivitiesPageClient from "@/app/activities/components/ActivitiesPageClient";
import { ActivityCard } from "@/app/activities/data/type";

export default async function ActivitiesPage() {
  let featuredCards: ActivityCard[] = [];
  let upcomingCards: ActivityCard[] = [];
  let loading = true;

  try {
    const result = await fetchFeaturedAndCarousel();
    featuredCards = result.featuredCards;
    upcomingCards = result.upcomingCards;
    loading = result.loading;
  } catch (error) {
    console.log("Server-side fetch failed, will load data on client side:", error);
    loading = true;
  }

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
