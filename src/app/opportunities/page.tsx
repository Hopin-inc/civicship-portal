import React, { Suspense } from "react";
import { fetchFeaturedAndCarousel } from "./data/fetchOpportunities";
import OpportunitiesPageClient from "./components/OpportunitiesPageClient";
import { GqlOpportunityCategory } from "@/types/graphql";
import FeaturedSectionSkeleton from "./components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "./components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "./components/ListSection/ListSectionSkeleton";

interface OpportunitiesPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams;
  const category = params.category === "ACTIVITY" 
    ? GqlOpportunityCategory.Activity 
    : params.category === "QUEST" 
    ? GqlOpportunityCategory.Quest 
    : undefined;

  const { featuredCards, upcomingCards } = await fetchFeaturedAndCarousel(category);

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
        category={category}
      />
    </Suspense>
  );
}
