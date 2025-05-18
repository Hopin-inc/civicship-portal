"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useSearchResults } from "@/app/search/result/hooks/useSearchResults";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";
import ErrorState from "@/components/shared/ErrorState";
import { useSearchParams } from "next/navigation";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";

export default function SearchResultPage() {
  const searchParams = useSearchParams();

  const queryParams = useMemo(
    () => ({
      location: searchParams.get("location") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      guests: searchParams.get("guests") ?? undefined,
      type: searchParams.get("type") as "activity" | "quest" | undefined,
      ticket: searchParams.get("ticket") ?? undefined,
      q: searchParams.get("q") ?? undefined,
    }),
    [searchParams],
  );
  useSearchResultHeader(queryParams);

  const { recommendedOpportunities, groupedOpportunities, loading, error, refetch } =
    useSearchResults(queryParams);

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
    return <EmptySearchResults searchQuery={queryParams.q} />;
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
