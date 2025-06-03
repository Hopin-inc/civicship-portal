"use client";

import { useEffect, useMemo, useRef, useState, Suspense, lazy } from "react";
import { useActivities } from "@/app/activities/hooks/useActivities";
import { mapOpportunityCards, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { ActivityCard } from "../data/type";

const ActivitiesListSection = lazy(() => import("@/app/activities/components/ListSection/ListSection"));
const ActivitiesCarouselSection = lazy(() => import("@/app/activities/components/CarouselSection/CarouselSection"));

export default function ClientSideSections() {
  const [showOtherSections, setShowOtherSections] = useState(false);
  const prevEdgeCountRef = useRef<number>(0);
  const listCardsRef = useRef<ActivityCard[]>([]);

  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = requestIdleCallback(() => {
        setShowOtherSections(true);
      });
      return () => cancelIdleCallback(idleCallback);
    } else {
      const timer = setTimeout(() => {
        setShowOtherSections(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const { upcomingCards, listCards } = useMemo(() => {
    if (!opportunities?.edges?.length) {
      return { upcomingCards: [], listCards: [] };
    }

    const activityCards = mapOpportunityCards(opportunities.edges);
    const result = sliceActivitiesBySection(activityCards);

    if (prevEdgeCountRef.current === 0) {
      listCardsRef.current = result.listCards;
    } else if (opportunities.edges.length > prevEdgeCountRef.current) {
      const newCards = mapOpportunityCards(opportunities.edges.slice(prevEdgeCountRef.current));
      const newListCards = newCards.filter(
        (card) =>
          !result.featuredCards.some((fc) => fc.id === card.id) &&
          !result.upcomingCards.some((uc) => uc.id === card.id),
      );
      listCardsRef.current = [...listCardsRef.current, ...newListCards];
    }

    prevEdgeCountRef.current = opportunities.edges.length;

    return {
      upcomingCards: result.upcomingCards,
      listCards: listCardsRef.current,
    };
  }, [opportunities]);

  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!showOtherSections) {
    return null;
  }

  return (
    <Suspense fallback={<div className="h-32 flex items-center justify-center"><LoadingIndicator /></div>}>
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
    </Suspense>
  );
}
