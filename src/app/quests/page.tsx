import { fetchFeaturedAndCarousel } from "./data/fetchQuests";
import QuestsPageClient from "./components/QuestsPageClient";

export default async function QuestsPage() {
  const { featuredCards, upcomingCards } = await fetchFeaturedAndCarousel();
  return <QuestsPageClient featuredCards={featuredCards} upcomingCards={upcomingCards} />;
}
