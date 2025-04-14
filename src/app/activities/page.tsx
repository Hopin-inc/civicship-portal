'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_OPPORTUNITIES } from '@/graphql/queries/opportunities'
import OpportunityCard, { OpportunityCardProps } from '../components/features/opportunity/OpportunityCard'
import FeaturedSection from '../components/features/activity/FeaturedSection'
import { useHeader } from '@/contexts/HeaderContext'
import { GetOpportunitiesData, Opportunity } from '@/types'
import { OpportunityCategory } from '@/gql/graphql'

export default function ActivitiesPage() {
  const { updateConfig, resetConfig } = useHeader()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const queryVariables = useMemo(() => ({
    upcomingFilter: {
      category: OpportunityCategory.Activity,
      publishStatus: ["PUBLIC"]
    },
    featuredFilter: {
      category: OpportunityCategory.Activity,
      publishStatus: ["PUBLIC"],
      not: {
        articleIds: null
      }
    },
    allFilter: {
      category: OpportunityCategory.Activity,
      publishStatus: ["PUBLIC"]
    },
    first: 20,
    cursor: null
  }), [])

  const { data, loading, error, fetchMore } = useQuery<GetOpportunitiesData>(GET_OPPORTUNITIES, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && data?.all.pageInfo.hasNextPage) {
          fetchMore({
            variables: {
              ...queryVariables,
              cursor: data.all.pageInfo.endCursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...prev,
                all: {
                  ...prev.all,
                  edges: [...prev.all.edges, ...fetchMoreResult.all.edges],
                  pageInfo: fetchMoreResult.all.pageInfo,
                },
              };
            },
          });
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [data?.all.pageInfo, fetchMore, loading, queryVariables])

  useEffect(() => {
    updateConfig({
      showLogo: true,
      showSearchForm: true,
    })

    return () => {
      resetConfig()
    }
  }, [updateConfig, resetConfig])

  if (loading && !data) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { upcoming, featured, all } = data || { upcoming: { edges: [] }, featured: { edges: [] }, all: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } }

  const mapNodeToCardProps = (node: Opportunity): OpportunityCardProps => ({
    id: node.id,
    title: node.title,
    price: node.feeRequired || null,
    location: node.place?.name || '場所未定',
    imageUrl: node.images?.[0] || null,
    community: {
      id: node.community?.id || '',
    },
    isReservableWithTicket: node.isReservableWithTicket || false,
  })

  return (
    <div className="min-h-screen pb-16">
      <FeaturedSection opportunities={upcoming.edges.map(edge => mapNodeToCardProps(edge.node))} />

      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">もうすぐ開催</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {upcoming.edges.map(({ node }) => (
            <OpportunityCard 
              key={node.id}
              {...mapNodeToCardProps(node)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">特集</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featured.edges.map(({ node }) => (
            <OpportunityCard 
              key={node.id}
              {...mapNodeToCardProps(node)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 px-4 pb-8">
        <h2 className="text-xl font-bold">すべての体験</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {all.edges.map(({ node }) => (
            <OpportunityCard 
              key={node.id}
              {...mapNodeToCardProps(node)}
              vertical
            />
          ))}
        </div>
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>}
        </div>
      </section>
    </div>
  )
}
