"use client";
import { CarouselSection } from "@/app/components/CarouselSection";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";
import EmptySearchResults from "@/app/search/result/components/EmptySearchResults";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import useSearchResults from "@/app/search/result/hooks/useSearchResults";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

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
        redirectTo: "/quests",
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