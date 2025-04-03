'use client'

import { FC, useState, useEffect } from 'react'
import { MapPin, CalendarIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import OpportunityCard from '@/app/components/features/activity/OpportunityCard'
import { Opportunity } from '@/types'
import { useHeader } from '@/contexts/HeaderContext'
import { useQuery } from '@apollo/client'
import { SEARCH_OPPORTUNITIES } from '@/graphql/queries/search'
import { OpportunityCategory, PublishStatus, OpportunityFilterInput } from '@/gql/graphql'

interface SearchResultPageProps {
  searchParams?: {
    location?: string
    from?: string
    to?: string
    guests?: string
    type?: 'activity' | 'quest'
  }
}

export default function Page({ searchParams = {} }: SearchResultPageProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const { updateConfig } = useHeader()

  const buildFilter = (): OpportunityFilterInput => {
    const filter: OpportunityFilterInput = {
      publishStatus: [PublishStatus.Public],
    }

    // Filter by type (experience or quest)
    if (searchParams.type === 'activity') {
      filter.category = OpportunityCategory.Activity
    } else if (searchParams.type === 'quest') {
      filter.category = OpportunityCategory.Quest
    }

    // Filter by location (prefecture)
    if (searchParams.location) {
      filter.cityCodes = [searchParams.location]
    }

    // Filter by date range with proper date handling
    if (searchParams.from || searchParams.to) {
      if (searchParams.from) {
        const fromDate = new Date(searchParams.from)
        fromDate.setUTCHours(0, 0, 0, 0)
        filter.slotStartsAt = fromDate.toISOString() as any
      }
      
      if (searchParams.to) {
        const toDate = new Date(searchParams.to)
        toDate.setUTCHours(23, 59, 59, 999)
        filter.slotEndsAt = toDate.toISOString() as any
      }
    }

    // Filter by guest count
    if (searchParams.guests) {
      const guestCount = parseInt(searchParams.guests, 10)
      if (!isNaN(guestCount) && guestCount > 0) {
        filter.slotRemainingCapacity = guestCount
      }
    }

    return filter
  }

  const { data, loading: queryLoading, error } = useQuery(SEARCH_OPPORTUNITIES, {
    variables: {
      filter: buildFilter(),
      first: 20
    },
    fetchPolicy: 'network-only',
  })

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
    if (data?.opportunities?.edges) {
      const transformedOpportunities = data.opportunities.edges.map((edge: any) => {
        const node = edge.node
        if (!node) {
          return null
        }

        const slot = node.slots?.edges[0]?.node

        const transformed = {
          id: node.id,
          title: node.title,
          description: node.description,
          type: node.category === OpportunityCategory.Quest ? 'QUEST' : 'EVENT',
          status: 'open',
          communityId: '',
          hostId: '',
          startsAt: slot?.startsAt || new Date().toISOString(),
          endsAt: slot?.endsAt || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          host: {
            name: '',
            image: '',
            title: '',
            bio: ''
          },
          image: node.image || '',
          location: {
            name: node.place?.name || '場所未定',
            address: node.place?.address || '',
            isOnline: false
          },
          recommendedFor: [],
          capacity: slot?.capacity || 0,
          pointsForComplete: node.pointsToEarn || 0,
          participants: []
        }
        return transformed
      }).filter(Boolean) as Opportunity[]

      setOpportunities(transformedOpportunities)
      setLoading(false)
    }
  }, [data])

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
        {loading || queryLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            エラーが発生しました: {error.message}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-500">検索条件に一致する体験・クエストが見つかりませんでした。</p>
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
                        id={opportunity.id}
                        title={opportunity.title}
                        price={opportunity.pointsForComplete || 0}
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
                          id={opportunity.id}
                          title={opportunity.title}
                          price={opportunity.pointsForComplete || 0}
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