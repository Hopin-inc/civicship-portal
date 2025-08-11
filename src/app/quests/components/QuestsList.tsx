"use client";
import { OpportunityCarouselListSection } from "@/components/domains/opportunities/components/ListSection/OpportunityCarouselListSection";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import useSearchResults from "@/app/search/result/hooks/useSearchResults";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { formatOpportunities } from "@/components/domains/opportunities/utils";

export default function QuestsList() {
    const searchParams = useSearchParams();
    
    const queryParams = useMemo(
      () => ({
        location: searchParams.get("location") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        guests: searchParams.get("guests") ?? undefined,
        type: "quest" as "quest" | undefined,
        ticket: searchParams.get("ticket") ?? undefined,
        points: searchParams.get("points") ?? undefined,
        q: searchParams.get("q") ?? undefined,
      }),
      [searchParams],
    );

    useSearchResultHeader(queryParams);

    const { 
      recommendedOpportunities, 
      groupedOpportunities, 
      loading, 
      loadMoreRef,
      isLoadingMore,
    } = useSearchResults(queryParams);

    const isEmpty =
    recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0;

  if (!loading && isEmpty) {
    return <EmptySearchResults searchQuery={queryParams.q} />;
  }

  const formattedOpportunities = recommendedOpportunities.map(formatOpportunities);

  return (
    <>
    <div className="min-h-screen">
      <main>
        <div className="pt-4">
        <OpportunityCarouselListSection
          title="おすすめのお手伝い"
          opportunities={formattedOpportunities}
        />
        </div>
        <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
        {/* 無限スクロール用のローディング要素 - 常に表示 */}
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoadingMore && (
            <div className="flex items-center space-x-2">
              <LoadingIndicator fullScreen={false}/>
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
}