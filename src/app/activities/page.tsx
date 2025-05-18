"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActivities } from "@/app/activities/hooks/useActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesListSection from "@/app/activities/components/ListSection/ListSection";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import { GqlOpportunity, GqlOpportunityEdge } from "@/types/graphql";
import { ActivityCard } from "@/app/activities/data/type";
import { presenterActivityCard, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

const mapOpportunityCards = (edges: GqlOpportunityEdge[]): ActivityCard[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterActivityCard);

export default function ActivitiesPage() {
  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!loading && !opportunities?.edges?.length) {
    return <EmptyState title={"募集"} />;
  }

  const activityCards = mapOpportunityCards(opportunities.edges);
  const { upcomingCards, featuredCards, listCards } = sliceActivitiesBySection(activityCards);

  return (
    <div className="min-h-screen">
      <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={false} />
      <ActivitiesCarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={false}
      />
      <ActivitiesListSection
        opportunities={listCards}
        loadMoreRef={loadMoreRef}
        isInitialLoading={false}
        isSectionLoading={loading}
      />
    </div>
  );
}
