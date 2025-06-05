"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
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

export default function ActivitiesPage() {
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

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { upcomingCards, featuredCards, listCards } = useMemo(() => {
    if (!opportunities?.edges?.length) {
      return { upcomingCards: [], featuredCards: [], listCards: [] };
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
      featuredCards: result.featuredCards,
      listCards: listCardsRef.current,
    };
  }, [opportunities]);

  useEffect(() => {
    if (!loading && featuredCards.length > 0) {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
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
    }
  }, [loading, featuredCards.length]);

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
}
