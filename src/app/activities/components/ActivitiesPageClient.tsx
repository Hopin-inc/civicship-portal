"use client";

import { useEffect, useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import ActivitiesListSection from "./ListSection/ListSection";
import ListSectionSkeleton from "./ListSection/ListSectionSkeleton";
import { mapOpportunityCards } from "../data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { ActivityCard } from "../data/type";

interface Props {
  initialData?: ActivityCard[];
}

export default function ActivitiesPageClient({ initialData }: Props) {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities({
    initialData: initialData ? { 
      edges: initialData.map((card, index) => ({ 
        __typename: "OpportunityEdge" as const,
        cursor: `cursor_${index}`, 
        node: card as any
      })), 
      pageInfo: { 
        __typename: "PageInfo" as const,
        hasNextPage: true, 
        hasPreviousPage: false, 
        startCursor: null, 
        endCursor: `cursor_${initialData.length - 1}` 
      },
      totalCount: initialData.length,
      __typename: "OpportunitiesConnection" as const
    } : undefined
  });

  // refetchRef を正しく更新
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const listCards = mapOpportunityCards(opportunities.edges ?? []);
  const isFirstLoaded = !loading && opportunities?.edges?.length > 0;
  const isEmpty = !loading && opportunities?.edges?.length === 0;

  if (!isFirstLoaded && loading) {
    return (
      <div className="min-h-screen pb-16">
        <ListSectionSkeleton />
      </div>
    );
  }

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
