'use client'

import { useEffect, useMemo } from 'react'
import { useLoading } from '@/hooks/core/useLoading'
import { useActivities } from '@/hooks/features/activity/useActivities'
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig'
import ActivitiesFeaturedSection from '@/components/features/activity/ActivitiesFeaturedSection'
import ActivitiesUpcomingSection from '@/components/features/activity/ActivitiesUpcomingSection'
import ActivitiesAllSection from '@/components/features/activity/ActivitiesAllSection'
import { ErrorState } from "@/components/shared/ErrorState"
import { GqlOpportunity, GqlOpportunityEdge } from "@/types/graphql";
import { presenterActivityCard } from "@/presenters/opportunity";
import { ActivityCard } from "@/types/opportunity";

const mapOpportunityCards = (edges: GqlOpportunityEdge[]): ActivityCard[] =>
  edges
    .map(edge => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterActivityCard);

export default function ActivitiesPage() {
  const { setIsLoading } = useLoading()

  const headerConfig = useMemo(() => ({
    showLogo: true,
    showSearchForm: true
  }), [])
  useHeaderConfig(headerConfig);

  const {
    upcomingActivities,
    featuredActivities,
    allActivities,
    loading,
    error,
    loadMoreRef
  } = useActivities()

  useEffect(() => {
    setIsLoading(loading && !upcomingActivities?.edges?.length)
  }, [loading, upcomingActivities, setIsLoading])

  if (error) return <ErrorState message={`Error: ${error.message}`} />

  const featuredCards = mapOpportunityCards(featuredActivities.edges);
  const upcomingCards = mapOpportunityCards(upcomingActivities.edges);
  const allCards = mapOpportunityCards(allActivities.edges);

  return (
    <div className="min-h-screen pb-16">
      <ActivitiesFeaturedSection opportunities={featuredCards} />
      <ActivitiesUpcomingSection opportunities={upcomingCards} />
      <ActivitiesAllSection
        opportunities={allCards}
        loadMoreRef={loadMoreRef}
        isLoading={loading}
      />
    </div>
  )
}
