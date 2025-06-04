"use client";

import React, { useRef } from "react";
import { QuestCard } from "../../activities/data/type";
import { useQuests } from "../hooks/useQuests";
import dynamic from "next/dynamic";
import FeaturedSectionSkeleton from "../../activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "../../activities/components/CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "../../activities/components/ListSection/ListSectionSkeleton";
import { mapQuestCards } from "../data/presenter";
import ErrorState from "../../../components/shared/ErrorState";
import EmptyState from "../../../components/shared/EmptyState";

interface Props {
  featuredCards: QuestCard[];
  upcomingCards: QuestCard[];
}

const QuestsFeaturedSection = dynamic(() => import("../../activities/components/FeaturedSection/FeaturedSection"), {
  ssr: false,
  loading: () => <FeaturedSectionSkeleton />,
});

const QuestsCarouselSection = dynamic(() => import("../../activities/components/CarouselSection/CarouselSection"), {
  ssr: false,
  loading: () => <OpportunitiesCarouselSectionSkeleton title="注目のクエスト" />,
});

const QuestsListSection = dynamic(() => import("../../activities/components/ListSection/ListSection"), {
  ssr: false,
  loading: () => <ListSectionSkeleton />,
});

export default function QuestsPageClient({ featuredCards, upcomingCards }: Props) {
  const { opportunities, loading, error, loadMoreRef, refetch } = useQuests();
  const refetchRef = useRef<(() => void) | null>(refetch);

  if (error) {
    return (
      <ErrorState
        title="クエストの読み込みに失敗しました"
        refetchRef={refetchRef}
      />
    );
  }

  const listCards = mapQuestCards(opportunities.edges ?? []);

  if (loading && !opportunities?.edges?.length) {
    return (
      <div className="min-h-screen pb-16">
        <FeaturedSectionSkeleton />
        <OpportunitiesCarouselSectionSkeleton title="注目のクエスト" />
        <ListSectionSkeleton />
      </div>
    );
  }
  if (error) {
    return <ErrorState title="クエストの読み込みに失敗しました" refetchRef={refetchRef} />;
  }
  if (!loading && !opportunities?.edges?.length) {
    return <EmptyState title={"クエスト"} />;
  }

  return (
    <div className="min-h-screen">
      <QuestsFeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
      <QuestsCarouselSection
        title="注目のクエスト"
        opportunities={upcomingCards}
        isInitialLoading={loading}
      />
      <QuestsListSection
        opportunities={listCards}
        isInitialLoading={loading}
        isSectionLoading={loading}
      />
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
