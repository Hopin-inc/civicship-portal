"use client";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import useSearchResults from "@/app/search/result/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CarouselSection } from "@/app/components/CarouselSection";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import FeaturedSectionSkeleton from "./FeaturedSection/FeaturedSectionSkeleton";

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

    // 認証を待たずに即座に描画
    // データがない場合は空の状態を表示し、バックグラウンドでデータを取得
    if (!loading && isEmpty) {
      return <EmptySearchResults searchQuery={queryParams.q} />;
    }

    // 初期ローディング中は既存のスケルトン表示
    if (loading && recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0) {
      return <FeaturedSectionSkeleton />;
    }
  
  return (
    <>
    <div className="min-h-screen">
      <main>
        {/* おすすめの体験 - データがある場合のみ表示 */}
        {recommendedOpportunities.length > 0 && (
          <CarouselSection
            title="おすすめの体験"
            opportunities={recommendedOpportunities}
            isVertical={false}
          />
        )}
        
        {/* 日付別の体験一覧 - データがある場合のみ表示 */}
        {Object.keys(groupedOpportunities).length > 0 && (
          <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
        )}
        
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