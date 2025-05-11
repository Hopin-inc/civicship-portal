'use client'

import { useEffect, useMemo } from 'react'
import { useLoading } from '@/hooks/core/useLoading'
import { useActivities } from '@/hooks/features/activity/useActivities'
import { mapOpportunityToCardProps } from '@/presenters/opportunity'
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig'
import { OpportunityEdge } from '@/types'
import ActivitiesFeaturedSection from '@/components/features/activity/ActivitiesFeaturedSection'
import ActivitiesUpcomingSection from '@/components/features/activity/ActivitiesUpcomingSection'
import ActivitiesFeaturedItemsSection from '@/components/features/activity/ActivitiesFeaturedItemsSection'
import ActivitiesAllSection from '@/components/features/activity/ActivitiesAllSection'
import { ErrorState } from "@/components/shared/ErrorState"

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

  const featuredCards = featuredActivities.edges.map(({ node }: OpportunityEdge) => mapOpportunityToCardProps(node))
  const upcomingCards = upcomingActivities.edges.map(({ node }: OpportunityEdge) => mapOpportunityToCardProps(node))
  const allCards = allActivities.edges.map(({ node }: OpportunityEdge) => mapOpportunityToCardProps(node))

  return (
    <div className="min-h-screen pb-16">
      <ActivitiesFeaturedSection opportunities={upcomingCards} />
      <ActivitiesUpcomingSection opportunities={upcomingCards} />
      <ActivitiesFeaturedItemsSection opportunities={featuredCards} />
      <ActivitiesAllSection
        opportunities={allCards}
        loadMoreRef={loadMoreRef}
        isLoading={loading}
      />
    </div>
  )
}
