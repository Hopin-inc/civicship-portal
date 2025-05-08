'use client'

import { Opportunity } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { ParticipantsList } from '@/app/components/shared/ParticipantsList'

type OpportunityHistory = {
  id: string
  title: string
  description: string
  location?: {
    name: string
    address: string
  }
  date?: string
  images: {
    url: string
    alt: string
  }[]
  participants: {
    id: string
    name: string
    image?: string | null
  }[]
  community?: {
    id: string
  }
  isReservableWithTicket?: boolean
}

const ActivityCard = memo(({ opportunity }: { opportunity: OpportunityHistory }) => (
  <Link href={`/activities/${opportunity.id}`} className="block">
    <div className="flex-shrink-0 w-[200px] bg-white rounded-lg overflow-hidden">
      <div className="relative h-[250px] w-full">
        {opportunity.images[0] && (
          <Image
            src={opportunity.images[0].url}
            alt={opportunity.images[0].alt}
            fill
            className="object-cover"
          />
        )}
        {opportunity.isReservableWithTicket && (
          <div className="absolute top-2 left-2 bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium z-10">
            チケット利用可
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <ParticipantsList participants={opportunity.participants} size="md" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium line-clamp-1 mb-1">{opportunity.title}</h3>
        <div className="text-sm text-gray-500">
          {opportunity.date && <p>{opportunity.date}</p>}
          {opportunity.location && <p>・{opportunity.location.name}</p>}
        </div>
      </div>
    </div>
  </Link>
))
ActivityCard.displayName = 'ActivityCard'

const transformOpportunityToHistory = (opportunity: Opportunity): OpportunityHistory => {
  const images = [...(opportunity.images || [])];
  if (opportunity.image) {
    images.unshift(opportunity.image);
  }

  const slotParticipants = opportunity.slots?.edges?.flatMap(edge => 
    edge?.node?.participations?.edges?.map(p => ({
      id: p?.node?.user?.id || '',
      name: p?.node?.user?.name || '',
      image: p?.node?.user?.image,
    })) || []
  ) || [];

  const uniqueParticipants = Array.from(new Map(
    slotParticipants.map(p => [p.id, p])
  ).values());

  const firstSlot = opportunity.slots?.edges?.[0]?.node;
  const date = firstSlot?.startsAt 
    ? new Date(firstSlot.startsAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : undefined;

  return {
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    location: opportunity.place ? {
      name: opportunity.place.name,
      address: opportunity.place.address
    } : undefined,
    date,
    images: images.map(img => ({ url: img, alt: opportunity.title })),
    participants: uniqueParticipants,
    community: opportunity.community,
    isReservableWithTicket: opportunity.isReservableWithTicket,
  };
};

interface RecentActivitiesListProps {
  opportunities: Opportunity[];
}

export const RecentActivitiesList = ({ opportunities }: RecentActivitiesListProps) => {
  const opportunityHistories = opportunities.map(transformOpportunityToHistory);

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-bold mb-4">最近の関わり</h2>
      <div className="relative">
        <div className="flex overflow-x-auto gap-2 pb-4 -mx-4 px-4 scrollbar-hide">
          {opportunityHistories.map((opportunity) => (
            <ActivityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </div>
    </section>
  );
};
