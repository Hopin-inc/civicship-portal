"use client";

import React, { useEffect, useRef } from "react";
import { useSearchResults } from "@/app/search/result/hooks/useSearchResults";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import ErrorState from "@/components/shared/ErrorState";

interface SearchResultPageProps {
  searchParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: string;
    type?: "activity" | "quest";
    ticket?: string;
    q?: string;
  };
}

export default function SearchResultPage({ searchParams = {} }: SearchResultPageProps) {
  const { recommendedOpportunities, groupedOpportunities, loading, error, refetch } =
    useSearchResults(searchParams);
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="検索結果を読み込めませんでした" refetchRef={refetchRef} />;
  }

  const isEmpty =
    recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0;

  if (isEmpty) {
    return <EmptySearchResults searchQuery={searchParams.q} />;
  }

  return (
    <div className="min-h-screen">
      <main>
        <ActivitiesCarouselSection
          title="おすすめの体験"
          opportunities={recommendedOpportunities}
        />
        <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
      </main>
    </div>
  );
}
