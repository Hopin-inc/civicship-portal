"use client";

import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useActivities } from "@/app/activities/hooks/useActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesListSection from "@/app/activities/components/ListSection/ListSection";
import { ErrorState } from "@/components/shared/ErrorState";
import { GqlOpportunity, GqlOpportunityEdge } from "@/types/graphql";
import { ActivityCard } from "@/app/activities/data/type";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import { presenterActivityCard, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import useHeaderConfig from "@/hooks/useHeaderConfig";

const mapOpportunityCards = (edges: GqlOpportunityEdge[]): ActivityCard[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterActivityCard);

export default function ActivitiesPage() {
  const { setIsLoading } = useLoading();

  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { opportunities, loading, error, loadMoreRef } =
    useActivities();

  const isInitialLoading = loading && !opportunities?.edges?.length
  const isSectionLoading = loading && !isInitialLoading;

  useEffect(() => {
    setIsLoading(isInitialLoading);
  }, [isInitialLoading, setIsLoading]);

  if (error) return <ErrorState message={`Error: ${error.message}`} />;

  const activityCards = mapOpportunityCards(opportunities.edges);
  const {
    upcomingCards,
    featuredCards,
    listCards
  } = sliceActivitiesBySection(activityCards);

  return (
    <div className="min-h-screen pb-16">
      <ActivitiesFeaturedSection
        opportunities={featuredCards}
        isInitialLoading={isInitialLoading}
      />
      {/*<ActivitiesCarouselSection*/}
      {/*  title="特集"*/}
      {/*  opportunities={featuredCards}*/}
      {/*  isInitialLoading={isInitialLoading}*/}
      {/*/>*/}
      <ActivitiesCarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={isInitialLoading}
      />
      <ActivitiesListSection
        opportunities={listCards}
        loadMoreRef={loadMoreRef}
        isInitialLoading={isInitialLoading}
        isSectionLoading={isSectionLoading}
      />
    </div>
  );
}
