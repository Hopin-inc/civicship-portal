'use client'

import { Participant, Opportunity } from '@/types'
import Image from 'next/image'
import { memo, useState } from 'react'
import { AsymmetricImageGrid } from '@/app/components/ui/asymmetric-image-grid'
import { Button } from '@/app/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

type OpportunityHistory = {
  id: string
  date: string
  fullDate: string
  title: string
  description: string
  images: {
    url: string
    alt: string
  }[]
  participants: Participant[]
  additionalParticipants: number
}

type OpportunityHistoryGroup = {
  year: number
  opportunities: OpportunityHistory[]
}

const ParticipantAvatar = memo(({ participant }: { participant: Participant }) => (
  <div
    className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
    role="img"
    aria-label={`参加者: ${participant.name}`}
  >
    {participant.image && (
      <Image
        src={participant.image}
        alt={participant.name}
        className="object-cover"
        width={24}
        height={24}
      />
    )}
  </div>
))
ParticipantAvatar.displayName = 'ParticipantAvatar'

const AdditionalParticipantsBadge = memo(({ count }: { count: number }) => (
  <div
    className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600"
    role="status"
    aria-label={`追加の参加者: ${count}人`}
  >
    +{count}
  </div>
))
AdditionalParticipantsBadge.displayName = 'AdditionalParticipantsBadge'

const OpportunityCard = memo(({ opportunity, isLast }: { opportunity: OpportunityHistory; isLast: boolean }) => (
  <div className="relative pl-8">
    {/* Timeline dot and line */}
    <div className="absolute left-0 top-0 h-full">
      <div className="absolute left-[10px] top-2 w-3 h-3 bg-gray-200 rounded-full border-2 border-[#E4E4E7]" />
      <div className="absolute left-[15px] top-5 bottom-0 w-[1px] bg-gray-200" />
    </div>
    
    {/* Content */}
    <article className="pb-8">
      <time dateTime={opportunity.date} className="text-sm text-gray-500 mb-1 block">
        {opportunity.date}
      </time>
      <h3 className="text-lg font-medium mb-2">{opportunity.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{opportunity.description}</p>
      
      <AsymmetricImageGrid images={opportunity.images} className="mb-3" />

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {opportunity.participants.map((participant) => (
            <ParticipantAvatar key={participant.id} participant={participant} />
          ))}
          {opportunity.additionalParticipants > 0 && (
            <AdditionalParticipantsBadge count={opportunity.additionalParticipants} />
          )}
        </div>
        <span className="text-xs text-gray-500">
          {opportunity.participants.length + opportunity.additionalParticipants}人が参加
        </span>
      </div>
    </article>
  </div>
))
OpportunityCard.displayName = 'OpportunityCard'

// 年別グループコンポーネント
const YearGroup = memo(({ group }: { group: OpportunityHistoryGroup }) => (
  <section>
    <h2 className="text-lg font-medium mb-2 pl-8">{group.year}年</h2>
    <div>
      {group.opportunities.map((opportunity, index) => (
        <OpportunityCard 
          key={opportunity.id} 
          opportunity={opportunity} 
          isLast={index === group.opportunities.length - 1}
        />
      ))}
    </div>
  </section>
))
YearGroup.displayName = 'YearGroup'

const transformOpportunityToHistory = (opportunity: Opportunity): OpportunityHistory => {
  const date = new Date(opportunity.startsAt);
  const fullDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;
  const displayDate = `${date.getMonth() + 1}月${date.getDate()}日(${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;

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
    date: displayDate,
    fullDate: fullDate,
    title: opportunity.title,
    description: opportunity.description,
    images: images.map(img => ({ url: img.url, alt: img.caption || opportunity.title })),
    participants: uniqueParticipants,
    additionalParticipants: 0,
  };
};

const groupOpportunitiesByYear = (opportunities: OpportunityHistory[]): OpportunityHistoryGroup[] => {
  const groups = opportunities.reduce((acc, opportunity) => {
    const yearMatch = opportunity.fullDate.match(/(\d{4})年/);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    if (!acc[year]) {
      acc[year] = { year, opportunities: [] };
    }
    acc[year].opportunities.push(opportunity);
    return acc;
  }, {} as Record<number, OpportunityHistoryGroup>);

  return Object.values(groups).sort((a, b) => b.year - a.year);
};

interface RecentActivitiesTimelineProps {
  opportunities: Opportunity[];
}

export const RecentActivitiesTimeline = ({ opportunities }: RecentActivitiesTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const opportunityHistories = opportunities.map(transformOpportunityToHistory);
  const groupedOpportunities = groupOpportunitiesByYear(opportunityHistories);

  const displayedOpportunities = isExpanded 
    ? opportunityHistories 
    : opportunityHistories.slice(0, 2);

  const displayedGroups = groupOpportunitiesByYear(displayedOpportunities);

  // 残りの件数を計算
  const remainingCount = Math.max(0, opportunityHistories.length - 2);

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-bold">最近の関わり</h2>
      <div className="space-y-8">
        {displayedGroups.map((group) => (
          <YearGroup key={group.year} group={group} />
        ))}
      </div>
      {opportunityHistories.length > 2 && (
        <Button
          variant="default"
          className="w-full mt-6"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "表示を減らす" : "すべての関わりを表示"}
        >
          {isExpanded ? (
            <>
              表示を減らす
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              残り{remainingCount}件の関わりを表示
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </section>
  );
}; 