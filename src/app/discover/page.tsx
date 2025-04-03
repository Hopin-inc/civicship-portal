'use client'

import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_OPPORTUNITIES } from '@/graphql/queries/opportunities'
import OpportunityCard, { OpportunityCardProps } from '../components/features/discover/OpportunityCard'
import FeaturedSection from '../components/features/discover/FeaturedSection'
import { useHeader } from '@/contexts/HeaderContext'
import { GetOpportunitiesData, OpportunityNode } from '@/types/opportunity'

export default function DiscoverPage() {
  const { updateConfig, resetConfig } = useHeader()
  
  const queryVariables = useMemo(() => ({
    upcomingFilter: {
      slotStartsAt: new Date().toISOString(),
      publishStatus: ["PUBLIC"],
      slotHostingStatus: ["SCHEDULED"]
    },
    featuredFilter: {
      publishStatus: ["PUBLIC"],
      not: {
        articleIds: null
      }
    },
    allFilter: {
      publishStatus: ["PUBLIC"]
    },
    first: 10
  }), [])

  const { data, loading, error } = useQuery<GetOpportunitiesData>(GET_OPPORTUNITIES, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(() => {
    updateConfig({
      showLogo: true,
      showSearchForm: true,
    })

    return () => {
      resetConfig()
    }
  }, [updateConfig, resetConfig])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const { upcoming, featured, all } = data || { upcoming: { edges: [] }, featured: { edges: [] }, all: { edges: [] } }

  console.log('upcoming', upcoming)
  console.log('featured', featured)
  console.log('all', all)
  const mapNodeToCardProps = (node: OpportunityNode): OpportunityCardProps => ({
    id: node.id,
    title: node.title,
    price: node.feeRequired,
    location: node.place?.city?.name || '場所未定',
    imageUrl: node.image,
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
      </section>
    </div>
  )
}
