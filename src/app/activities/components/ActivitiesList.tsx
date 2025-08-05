"use client";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import useSearchResults from "@/app/search/result/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CarouselSection } from "@/app/components/CarouselSection";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivitiesList() {
    const searchParams = useSearchParams();
    
    const queryParams = useMemo(
      () => ({
        location: searchParams.get("location") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        guests: searchParams.get("guests") ?? undefined,
        type: "activity" as "activity" | undefined,
        ticket: searchParams.get("ticket") ?? undefined,
        points: searchParams.get("points") ?? undefined,
        q: searchParams.get("q") ?? undefined,
        redirectTo: "/activities",
      }),
      [searchParams],
    );
  
    useSearchResultHeader(queryParams);
  
    const { 
      recommendedOpportunities, 
      groupedOpportunities, 
      loading, 
      refetch,
      error,
      loadMoreRef,
      hasNextPage,
      isLoadingMore,
    } = useSearchResults(queryParams);

    const isEmpty =
    recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0;

    if (!loading && isEmpty) {
      return <EmptySearchResults searchQuery={queryParams.q} />;
    }
  
  return (
    <>
    <div className="min-h-screen">
      <main>
        <CarouselSection
          title="おすすめの体験"
          opportunities={recommendedOpportunities}
          isVertical={false}
        />
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