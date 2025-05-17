"use client";

import React from "react";
import { useSearchResults } from "@/app/search/result/hooks/useSearchResults";
import { DateGroupedOpportunities } from "@/app/search/result/components/DateGroupedOpportunities";
import { EmptySearchResults } from "@/app/search/result/components/EmptySearchResults";
import { ErrorState } from "@/components/shared/ErrorState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";

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
  const { recommendedOpportunities, groupedOpportunities, loading, error } =
    useSearchResults(searchParams);

  return (
    <div className="min-h-screen">
      <main className="px-6 pb-6">
        {loading ? (
          <LoadingIndicator fullScreen={true} />
        ) : error ? (
          <ErrorState
            title="検索エラー"
            message="検索結果の取得中にエラーが発生しました。もう一度お試しください。"
          />
        ) : recommendedOpportunities.length === 0 &&
          Object.keys(groupedOpportunities).length === 0 ? (
          <EmptySearchResults searchQuery={searchParams.q} />
        ) : (
          <div>
            <ActivitiesCarouselSection
              title={"おすすめの体験"}
              opportunities={recommendedOpportunities}
            />
            <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
          </div>
        )}
      </main>
    </div>
  );
}
