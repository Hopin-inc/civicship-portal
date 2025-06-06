import { fetchFeaturedAndCarousel } from "./data/fetchActivities";
import ActivitiesPageClient from "./components/ActivitiesPageClient";

export default async function ActivitiesPage() {
  const { featuredCards, upcomingCards } = await fetchFeaturedAndCarousel();
  return <ActivitiesPageClient featuredCards={featuredCards} upcomingCards={upcomingCards} />;
}
