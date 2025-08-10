"use client";
//使用されていないので次のフェーズで削除予定
import { useEffect, useMemo, useRef } from "react";
import { useActivities } from "../hooks/useActivities";
import OpportunitiesListSection from "@/components/domains/opportunity/components/ListSection/OpportunitiesGridListSection";
import { mapOpportunityCards } from "@/components/domains/opportunity/data/presenter";
import { ErrorState } from '@/components/shared'
import EmptyState from "@/components/shared/EmptyState";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { formatOpportunity } from "@/components/domains/opportunity/utils";

export default function ActivitiesPageClient() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const listCards = mapOpportunityCards(opportunities.edges ?? []);
  const isEmpty = !loading && opportunities?.edges?.length === 0;

  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (isEmpty) {
    return <EmptyState title="募集" />;
  }

  const formatOpportunities = listCards.map(formatOpportunity);
  
  return (
    <div className="min-h-screen">
      <OpportunitiesListSection
        opportunities={formatOpportunities}
        isInitialLoading={false}
        isSectionLoading={loading}
        opportunityTitle="すべての体験"
      />
      <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
    </div>
  );
}