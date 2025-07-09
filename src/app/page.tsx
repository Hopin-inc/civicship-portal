import HomeSection from "./components/HomeSection";
import { fetchFeaturedAndCarousel } from "./activities/data/fetchActivities";

export default async function HomePage() {
  const { featuredCards, upcomingCards, loading } = await fetchFeaturedAndCarousel();
  return <HomeSection featuredCards={featuredCards} upcomingCards={upcomingCards} loading={loading} />;
}
