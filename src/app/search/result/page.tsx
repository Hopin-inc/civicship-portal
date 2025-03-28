'use client'

import { FC, useState, useEffect } from 'react'
import { MapPin, CalendarIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import OpportunityCard from '@/app/components/features/discover/OpportunityCard'
import { Opportunity } from '@/types'
import { mockOpportunities } from '@/lib/data'
import { useHeader } from '@/contexts/HeaderContext'

interface SearchResultPageProps {
  searchParams?: {
    location?: string
    from?: string
    to?: string
    guests?: string
    type?: 'experience' | 'quest'
  }
}

export default function Page({ searchParams = {} }: SearchResultPageProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const { updateConfig } = useHeader()

  useEffect(() => {
    updateConfig({
      showSearchForm: true,
      searchParams: {
        location: searchParams.location,
        from: searchParams.from,
        to: searchParams.to,
        guests: searchParams.guests,
      },
      showLogo: false,
      showBackButton: true,
    })
  }, [searchParams.location, searchParams.from, searchParams.to, searchParams.guests, updateConfig])

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // mockOpportunitiesを使用
        setOpportunities(mockOpportunities)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch opportunities:', error)
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  const recommendedOpportunities = opportunities.filter(opp => opp.recommendedFor.length > 0)

  const groupedOpportunities = opportunities.reduce<{ [key: string]: Opportunity[] }>((acc, opp) => {
    const dateKey = format(new Date(opp.startsAt), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(opp)
    return acc
  }, {})

  return (
    <div className="min-h-screen">
      {/* 検索結果 */}
      <main className="pt-4 px-4 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="space-y-12">
            {recommendedOpportunities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">おすすめの体験</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {recommendedOpportunities.map(opportunity => (
                    <Link key={opportunity.id} href={`/experiences/${opportunity.id}`}>
                      <OpportunityCard
                        title={opportunity.title}
                        price={2000}
                        location={opportunity.location.name}
                        imageUrl={opportunity.image || ''}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {Object.entries(groupedOpportunities).map(([dateKey, dateOpportunities]) => {
              const date = new Date(dateKey)
              const month = date.getMonth() + 1
              const day = date.getDate()
              const weekday = format(date, 'E', { locale: ja })
              
              return (
                <section key={dateKey}>
                  <div className="flex items-center mb-4">
                    <div className="flex items-baseline mr-3">
                      <span className="text-md font-medium text-[#71717A]">{month}/</span>
                      <span className="text-[32px] font-normal text-[#09090B]">{day}</span>
                      <div className="flex items-baseline">
                        <span className="text-xs font-medium text-[#71717A]">(</span>
                        <span className="text-sm font-normal text-[#09090B]">{weekday}</span>
                        <span className="text-xs font-medium text-[#71717A]">)</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {dateOpportunities.map(opportunity => (
                      <Link key={opportunity.id} href={`/experiences/${opportunity.id}`}>
                        <OpportunityCard
                          title={opportunity.title}
                          price={2000}
                          location={opportunity.location.name}
                          imageUrl={opportunity.image || ''}
                          vertical
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
} 