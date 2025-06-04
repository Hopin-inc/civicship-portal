import React, { Suspense } from "react";
import { fetchFeaturedAndCarousel } from "./data/fetchOpportunities";
import OpportunitiesPageClient from "./components/OpportunitiesPageClient";
import FeaturedSectionSkeleton from "./components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "./components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "./components/ListSection/ListSectionSkeleton";

export default async function OpportunitiesPage() {
  const { featuredCards, upcomingCards } = await fetchFeaturedAndCarousel();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen pb-16">
          <FeaturedSectionSkeleton />
          <OpportunitiesCarouselSectionSkeleton title="もうすぐ開催予定" />
          <ListSectionSkeleton />
        </div>
      }
    >
      <OpportunitiesPageClient 
        featuredCards={featuredCards} 
        upcomingCards={upcomingCards}
      />
    </Suspense>
  );
}
