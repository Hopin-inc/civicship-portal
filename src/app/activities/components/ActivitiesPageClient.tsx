"use client";
import { useRef } from "react";
import { ActivityCard } from "../data/type";
import { useActivities } from "../hooks/useActivities";
import dynamic from "next/dynamic";
import FeaturedSectionSkeleton from "./FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "./CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "./ListSection/ListSectionSkeleton";
import { mapOpportunityCards } from "../data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
  featuredCards: ActivityCard[];
  upcomingCards: ActivityCard[];
}

const ActivitiesFeaturedSection = dynamic(() => import("./FeaturedSection/FeaturedSection"), {
  loading: () => <FeaturedSectionSkeleton />,
});
const ActivitiesCarouselSection = dynamic(() => import("./CarouselSection/CarouselSection"), {
  loading: () => <OpportunitiesCarouselSectionSkeleton title="もうすぐ開催予定" />,
});
const ActivitiesListSection = dynamic(() => import("./ListSection/ListSection"), {
  loading: () => <ListSectionSkeleton />,
});

export default function ActivitiesPageClient({ featuredCards, upcomingCards }: Props) {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();
  const refetchRef = useRef<(() => void) | null>(refetch);

  const listCards = mapOpportunityCards(opportunities.edges ?? []);

  if (loading && !opportunities?.edges?.length) {
    return (
      <div className="min-h-screen pb-16">
        <FeaturedSectionSkeleton />
        <OpportunitiesCarouselSectionSkeleton title="もうすぐ開催予定" />
        <ListSectionSkeleton />
      </div>
    );
  }
  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }
  if (!loading && !opportunities?.edges?.length) {
    return <EmptyState title={"募集"} />;
  }

  return (
    <div className="min-h-screen">
      <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
      <ActivitiesCarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={loading}
      />
      <ActivitiesListSection
        opportunities={listCards}
        isInitialLoading={loading}
        isSectionLoading={loading}
      />
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
