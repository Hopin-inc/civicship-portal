'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import OpportunityCard from '../components/features/discover/OpportunityCard'
import FeaturedSection from '../components/features/discover/FeaturedSection'
import { mockOpportunities } from '@/lib/data'
import { useHeader } from '@/contexts/HeaderContext'

export default function DiscoverPage() {
  const { updateConfig, resetConfig } = useHeader()
  
  useEffect(() => {
    updateConfig({
      showLogo: true,
      showSearchForm: true,
    })

    return () => {
      resetConfig()
    }
  }, [])

  const opportunities = mockOpportunities.map(opportunity => ({
    id: parseInt(opportunity.id),
    title: opportunity.title,
    price: 2000,
    location: opportunity.location.name,
    imageUrl: opportunity.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
  }))

  return (
    <div className="min-h-screen pb-16">
      <FeaturedSection opportunities={opportunities.slice(0, 5)} />

      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">もうすぐ開催</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {opportunities.slice(0, 5).map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} />
          ))}
        </div>
      </section>

      {/* 特集 */}
      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">特集</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {opportunities.slice(5, 10).map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} />
          ))}
        </div>
      </section>

      {/* すべての体験 */}
      <section className="mt-8 px-4 pb-8">
        <h2 className="text-xl font-bold">すべての体験</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} vertical />
          ))}
        </div>
      </section>
    </div>
  )
}
