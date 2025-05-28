"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActivities } from "@/app/activities/hooks/useActivities";
import ActivitiesFeaturedSection from "@/app/activities/components/FeaturedSection/FeaturedSection";
import ActivitiesListSection from "@/app/activities/components/ListSection/ListSection";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import { mapOpportunityCards, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import { ActivityCard } from "./data/type";

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

  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // opportunitiesが変更されたときにデータを処理
  const { upcomingCards, featuredCards, listCards } = useMemo(() => {
    if (!opportunities?.edges?.length) {
      return { upcomingCards: [], featuredCards: [], listCards: [] };
    }

    const activityCards = mapOpportunityCards(opportunities.edges);
    const result = sliceActivitiesBySection(activityCards);

    // 初回ロード時はリストカードを設定
    if (prevEdgeCountRef.current === 0) {
      listCardsRef.current = result.listCards;
    }

    // 追加ロード時は順序を保持するために新しいアイテムのみを追加
    else if (opportunities.edges.length > prevEdgeCountRef.current) {
      const newCards = mapOpportunityCards(opportunities.edges.slice(prevEdgeCountRef.current));
      // すでにfeaturedまたはupcomingセクションに含まれていないカードのみをフィルタリング
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
