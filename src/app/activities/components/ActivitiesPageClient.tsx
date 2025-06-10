"use client";
import { useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import dynamic from "next/dynamic";
import ListSectionSkeleton from "./ListSection/ListSectionSkeleton";
import { mapOpportunityCards } from "../data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

const ActivitiesListSection = dynamic(() => import("./ListSection/ListSection"), {
  loading: () => <ListSectionSkeleton />,
});

export default function ActivitiesPageClient() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();
  const refetchRef = useRef<(() => void) | null>(refetch);

  const listCards = mapOpportunityCards(opportunities.edges ?? []);

  if (loading && !opportunities?.edges?.length) {
    return (
      <div className="min-h-screen pb-16">
        <ListSectionSkeleton />
      </div>
    );
  }
  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }
  if (!loading && !opportunities?.edges?.length) {
    return <EmptyState title={"募集"} />;
  }

  return (
    <div className="min-h-screen">
      <ActivitiesListSection
        opportunities={listCards}
        isInitialLoading={loading}
        isSectionLoading={loading}
      />
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}
