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
}

const ActivityCard = memo(({ opportunity }: { opportunity: OpportunityHistory }) => (
  <Link href={`/activities/${opportunity.id}${opportunity.community?.id ? `?community_id=${opportunity.community.id}` : ''}`} className="block">
    <div className="flex-shrink-0 w-[200px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-[250px] w-full">
        {opportunity.images[0] && (
          <Image
            src={opportunity.images[0].url}
            alt={opportunity.images[0].alt}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute bottom-2 left-2">
          <ParticipantsList participants={opportunity.participants} size="md" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium line-clamp-2">{opportunity.title}</h3>
      </div>
    </div>
  </Link>
))
ActivityCard.displayName = 'ActivityCard'

const transformOpportunityToHistory = (opportunity: Opportunity): OpportunityHistory => {
  const images = opportunity.images || [];
  if (opportunity.image) {
    images.unshift({ url: opportunity.image, caption: opportunity.title });
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

  return {
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    images: images.map(img => ({ url: img.url, alt: img.caption || opportunity.title })),
    participants: uniqueParticipants,
    community: opportunity.community,
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
