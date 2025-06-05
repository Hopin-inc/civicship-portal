"use client";

import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActivities } from "@/app/activities/hooks/useActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import { mapOpportunityCards, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { ActivityCard } from "./data/type";

const ActivitiesListSection = lazy(
  () => import("@/app/activities/components/ListSection/ListSection"),
);
const ActivitiesCarouselSection = lazy(
  () => import("@/app/activities/components/CarouselSection/CarouselSection"),
);

const ActivitiesPage = React.memo(() => {
  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const prevEdgeCountRef = useRef<number>(0);
  const listCardsRef = useRef<ActivityCard[]>([]);
  const [showOtherSections, setShowOtherSections] = useState(false);

  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const handleShowOtherSections = useCallback(() => {
    setShowOtherSections(true);
  }, []);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const processedCards = useMemo(() => {
    if (!opportunities?.edges?.length) {
      return { upcomingCards: [], featuredCards: [], listCards: [] };
    }
    
    const allCards = mapOpportunityCards(opportunities.edges);
    return sliceActivitiesBySection(allCards);
  }, [opportunities?.edges]);

  const { upcomingCards, featuredCards, listCards } = useMemo(() => {
    if (!processedCards) return { upcomingCards: [], featuredCards: [], listCards: [] };
    
    if (prevEdgeCountRef.current === 0) {
      listCardsRef.current = processedCards.listCards;
      prevEdgeCountRef.current = opportunities?.edges?.length || 0;
      return processedCards;
    }
    
    if (!opportunities?.edges?.length || opportunities.edges.length <= prevEdgeCountRef.current) {
      return {
        upcomingCards: processedCards.upcomingCards,
        featuredCards: processedCards.featuredCards,
        listCards: listCardsRef.current,
      };
    }
    
    const newCards = mapOpportunityCards(
      opportunities.edges.slice(prevEdgeCountRef.current)
    );
    
    if (newCards.length === 0) {
      return {
        upcomingCards: processedCards.upcomingCards,
        featuredCards: processedCards.featuredCards,
        listCards: listCardsRef.current,
      };
    }
    
    const existingIds = new Set([
      ...processedCards.featuredCards.map(card => card.id),
      ...processedCards.upcomingCards.map(card => card.id),
      ...listCardsRef.current.map(card => card.id)
    ]);
    
    const uniqueNewCards = newCards.filter(card => !existingIds.has(card.id));
    listCardsRef.current = [...listCardsRef.current, ...uniqueNewCards];
    prevEdgeCountRef.current = opportunities.edges.length;
    
    return {
      upcomingCards: processedCards.upcomingCards,
      featuredCards: processedCards.featuredCards,
      listCards: listCardsRef.current,
    };
  }, [processedCards, opportunities?.edges]);

  useEffect(() => {
    if (!loading && featuredCards.length > 0) {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const idleCallback = requestIdleCallback(handleShowOtherSections);
        return () => cancelIdleCallback(idleCallback);
      } else {
        const timer = setTimeout(handleShowOtherSections, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, featuredCards.length, handleShowOtherSections]);

  if (loading && prevEdgeCountRef.current === 0) {
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
      <ActivitiesFeaturedSection opportunities={featuredCards} isInitialLoading={false} />

      {showOtherSections && (
        <>
          <Suspense
            fallback={
              <div className="h-32 flex items-center justify-center">
                <LoadingIndicator />
              </div>
            }
          >
            <ActivitiesCarouselSection
              title="もうすぐ開催予定"
              opportunities={upcomingCards}
              isInitialLoading={false}
            />
            <ActivitiesListSection
              opportunities={listCards}
              isInitialLoading={false}
              isSectionLoading={loading}
            />
          </Suspense>

          <div ref={loadMoreRef} className="h-10" />
        </>
      )}
    </div>
  );
});

ActivitiesPage.displayName = 'ActivitiesPage';

export default ActivitiesPage;
