"use client";
import { useMemo, useRef } from "react";
import { GqlOpportunitiesConnection } from "@/types/graphql";
import { useActivities } from "../hooks/useActivities";
import ActivitiesFeaturedSection from "./FeaturedSection/FeaturedSection";
import ActivitiesListSection from "./ListSection/ListSection";
import ActivitiesCarouselSection from "./CarouselSection/CarouselSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { mapOpportunityCards, sliceActivitiesBySection } from "../data/presenter";

interface Props {
  initialData: GqlOpportunitiesConnection;
}

export default function ActivitiesPageClient({ initialData }: Props) {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities({ initialData });
  const refetchRef = useRef<(() => void) | null>(refetch);

  const { upcomingCards, featuredCards, listCards } = useMemo(() => {
    const activityCards = mapOpportunityCards(opportunities.edges ?? []);
    return sliceActivitiesBySection(activityCards);
  }, [opportunities]);

  if (loading && !opportunities?.edges?.length) {
    return <LoadingIndicator />;
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
