"use client";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import useSearchResults from "@/app/search/result/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { CarouselSection } from "@/app/components/CarouselSection";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";

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
        q: searchParams.get("q") ?? undefined,
        redirectTo: "/activities",
      }),
      [searchParams],
    );
  
    useSearchResultHeader(queryParams);
  
    const { recommendedOpportunities, groupedOpportunities, loading, error, refetch } =
    useSearchResults(queryParams);

    const isEmpty =
    recommendedOpportunities.length === 0 && Object.keys(groupedOpportunities).length === 0;

  if (isEmpty) {
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
      </main>
    </div>
    </>
  );
}