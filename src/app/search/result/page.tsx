"use client";

import React from "react";
import { useSearchResults } from "@/app/search/hooks/useSearchResults";
import { SearchResultHeader } from "@/app/search/components/SearchResultHeader";
import { RecommendedOpportunities } from "@/app/search/components/RecommendedOpportunities";
import { DateGroupedOpportunities } from "@/app/search/components/DateGroupedOpportunities";
import { EmptySearchResults } from "@/app/search/components/EmptySearchResults";
import { ErrorState } from "@/components/shared/ErrorState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

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

/**
 * Search results page component
 */
export default function Page({ searchParams = {} }: SearchResultPageProps) {
  const { recommendedOpportunities, groupedOpportunities, loading, error } =
    useSearchResults(searchParams);

  return (
    <div className="min-h-screen">
      <SearchResultHeader />

      <main className="pt-20 px-4 pb-24">
        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorState
            title="検索エラー"
            message="検索結果の取得中にエラーが発生しました。もう一度お試しください。"
          />
        ) : recommendedOpportunities.length === 0 &&
          Object.keys(groupedOpportunities).length === 0 ? (
          <EmptySearchResults searchQuery={searchParams.q} />
        ) : (
          <div className="space-y-12">
            <RecommendedOpportunities opportunities={recommendedOpportunities} />
            <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
          </div>
        )}
      </main>
    </div>
  );
}
