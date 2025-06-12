"use client";

import { useEffect, useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import ActivitiesListSection from "./ListSection/ListSection";
import { mapOpportunityCards } from "../data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

export default function ActivitiesPageClient() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const listCards = mapOpportunityCards(opportunities.edges ?? []);
  const isFirstLoaded = !loading && opportunities?.edges?.length > 0;
  const isEmpty = !loading && opportunities?.edges?.length === 0;

  // if (!isFirstLoaded && loading) {
  //   return (
  //     <div className="min-h-screen pb-16">
  //       <ListSectionSkeleton />
  //     </div>
  //   );
  // }

  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (isEmpty) {
    return <EmptyState title="募集" />;
  }

  return (
    <div className="min-h-screen">
      <ActivitiesListSection
        opportunities={listCards}
        isInitialLoading={false}
        isSectionLoading={loading}
      />
      <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
    </div>
  );
}
