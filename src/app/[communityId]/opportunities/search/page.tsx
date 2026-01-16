"use client";
import DateGroupedOpportunities from "@/app/[communityId]/search/result/components/DateGroupedOpportunities";
import EmptySearchResults from "@/app/[communityId]/search/result/components/EmptySearchResults";
import useSearchResultHeaderHook from "@/app/[communityId]/search/result/components/SearchResultHeader";
import useSearchResultsHook from "@/app/[communityId]/search/result/hooks/useSearchResults";
import { OpportunityCarouselListSection } from "@/components/domains/opportunities/components/ListSection/OpportunityCarouselListSection";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SearchPage() {
    const searchParams = useSearchParams();
    
    const queryParams = useMemo(
      () => ({
        location: searchParams.get("location") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        guests: searchParams.get("guests") ?? undefined,
        type: searchParams.get("type") as "activity" | "quest" | undefined,
        ticket: searchParams.get("ticket") ?? undefined,
        points: searchParams.get("points") ?? undefined,
        q: searchParams.get("q") ?? undefined,
      }),
      [searchParams],
    );

    useSearchResultHeaderHook(queryParams);

    const { 
        recommendedOpportunities, 
        groupedOpportunities, 
        loading, 
        loadMoreRef,
        isLoadingMore,
      } = useSearchResultsHook(queryParams);

    const isEmpty =
    recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0;

  if (!loading && isEmpty) {
    return <EmptySearchResults searchQuery={queryParams.q} />;
  }

  const formattedOpportunities = recommendedOpportunities.map(formatOpportunities);

  const getTitle = () => {
    if(queryParams.type === "quest"){
      return "おすすめのお手伝い";
    }else{
      return "おすすめの体験";
    }
  }

  return(
  <div>
    <div className="min-h-screen">
      <main>
        <div className="pt-4">
          <OpportunityCarouselListSection
            title={getTitle()}
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
  </div>);
}