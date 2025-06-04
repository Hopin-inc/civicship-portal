"use client";
import React, { useRef } from "react";
import { OpportunityCard } from "@/app/activities/data/type";
import { useOpportunities } from "../hooks/useOpportunities";
import dynamic from "next/dynamic";
import FeaturedSectionSkeleton from "./FeaturedSection/FeaturedSectionSkeleton";
import OpportunitiesCarouselSectionSkeleton from "./CarouselSection/CarouselSectionSkeleton";
import ListSectionSkeleton from "./ListSection/ListSectionSkeleton";
import { mapOpportunityCards } from "@/app/activities/data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { GqlOpportunityCategory } from "@/types/graphql";

interface Props {
  featuredCards: OpportunityCard[];
  upcomingCards: OpportunityCard[];
}

const OpportunitiesFeaturedSection = dynamic(() => import("./FeaturedSection/FeaturedSection"), {
  loading: () => <FeaturedSectionSkeleton />,
});
const OpportunitiesCarouselSection = dynamic(() => import("./CarouselSection/CarouselSection"), {
  loading: () => <OpportunitiesCarouselSectionSkeleton title="もうすぐ開催予定" />,
});
const OpportunitiesListSection = dynamic(() => import("./ListSection/ListSection"), {
  loading: () => <ListSectionSkeleton />,
});

export default function OpportunitiesPageClient({ featuredCards, upcomingCards }: Props) {
  const { opportunities, loading, error, loadMoreRef, refetch } = useOpportunities();
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
    return <ErrorState title="機会一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }
  if (!loading && !opportunities?.edges?.length) {
    return <EmptyState title={"機会"} />;
  }

  return (
    <div className="min-h-screen">
      <OpportunitiesFeaturedSection opportunities={featuredCards} isInitialLoading={loading} />
      <OpportunitiesCarouselSection
        title="もうすぐ開催予定"
        opportunities={upcomingCards}
        isInitialLoading={loading}
      />
      <OpportunitiesListSection
        opportunities={listCards}
        isInitialLoading={loading}
        isSectionLoading={loading}
      />
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
