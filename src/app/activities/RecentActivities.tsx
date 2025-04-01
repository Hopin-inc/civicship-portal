'use client'

import { Activity, Participant } from '@/types'
import Image from 'next/image'
import { memo } from 'react'
import { AsymmetricImageGrid } from '@/app/components/ui/asymmetric-image-grid'
import { Button } from '@/app/components/ui/button'

type ActivityHistory = {
  id: string
  date: string
  title: string
  description: string
  images: {
    url: string
    alt: string
  }[]
  participants: Participant[]
  additionalParticipants: number
}

type ActivityHistoryGroup = {
  year: number
  activities: ActivityHistory[]
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

// 追加参加者数バッジコンポーネント
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

// アクティビティカードコンポーネント
const ActivityCard = memo(({ activity, isLast }: { activity: ActivityHistory; isLast: boolean }) => (
  <div className="relative pl-8">
    {/* Timeline dot and line */}
    <div className="absolute left-0 top-0 h-full">
      <div className="absolute left-[10px] top-2 w-3 h-3 bg-gray-200 rounded-full border-2 border-[#E4E4E7]" />
      <div className="absolute left-[15px] top-5 bottom-0 w-[1px] bg-gray-200" />
    </div>
    
    {/* Content */}
    <article className="pb-8">
      <time dateTime={activity.date} className="text-sm text-gray-500 mb-1 block">
        {activity.date}
      </time>
      <h3 className="text-lg font-medium mb-2">{activity.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
      
      <AsymmetricImageGrid images={activity.images} className="mb-3" />

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {activity.participants.map((participant) => (
            <ParticipantAvatar key={participant.id} participant={participant} />
          ))}
          {activity.additionalParticipants > 0 && (
            <AdditionalParticipantsBadge count={activity.additionalParticipants} />
          )}
        </div>
        <span className="text-xs text-gray-500">
          {activity.participants.length + activity.additionalParticipants}人が参加
        </span>
      </div>
    </article>
  </div>
))
ActivityCard.displayName = 'ActivityCard'

// 年別グループコンポーネント
const YearGroup = memo(({ group }: { group: ActivityHistoryGroup }) => (
  <section>
    <h2 className="text-lg font-medium mb-2 pl-8">{group.year}年</h2>
    <div>
      {group.activities.map((activity, index) => (
        <ActivityCard 
          key={activity.id} 
          activity={activity} 
          isLast={index === group.activities.length - 1}
        />
      ))}
    </div>
  </section>
))
YearGroup.displayName = 'YearGroup'

// メインコンポーネント
export const RecentActivities = () => {
  return (
    <section className="mb-6">
      <h2 className="text-2xl font-bold">最近の関わり</h2>
      <div className="space-y-8">
        {MOCK_DATA.map((group) => (
          <YearGroup key={group.year} group={group} />
        ))}
      </div>
      <Button
        variant="default"
        className="w-full mt-6"
        onClick={() => {/* TODO: Implement view all handler */}}
        aria-label="すべての関わりを表示"
      >
        35件の関わりをすべて見る
      </Button>
    </section>
  )
}

// モックデータは別ファイルに移動することを推奨
const MOCK_DATA: ActivityHistoryGroup[] = [
  {
    year: 2025,
    activities: [
      {
        id: '1',
        date: '2月6日(木)',
        title: 'みかん山でドライフルーツのリース作り',
        description: '四国の伝統的な食文化をデジタルで記録・保存する意義と手法について、食文化研究者とデジタルア...',
        images: [
          { url: '/images/activities/haiku.png', alt: '雪山と湖の風景' },
          { url: '/images/activities/stole.jpg', alt: '夕暮れの風景' },
          { url: '/images/activities/udon.png', alt: '山の夕暮れ' }
        ],
        participants: [
          { id: '1', name: '参加者1', image: '/images/activities/haiku.png' },
          { id: '2', name: '参加者2', image: '/images/activities/haiku.png' }
        ],
        additionalParticipants: 3
      },
      {
        id: '2',
        date: '2月4日(火)',
        title: '漁港で朝獲れ鯛の捌き体験　最後は浜辺...',
        description: '四国の伝統的な食文化をデジタルで記録・保存する意義と手法について、食文化研究者とデジタルア...',
        images: [
          { url: '/images/activities/haiku.png', alt: '雪山の風景' },
          { url: '/images/activities/stole.jpg', alt: '森の風景' },
          { url: '/images/activities/udon.png', alt: '湖の風景' }
        ],
        participants: [
          { id: '3', name: '参加者3', image: '/images/activities/haiku.png' },
          { id: '4', name: '参加者4', image: '/images/activities/haiku.png' }
        ],
        additionalParticipants: 2
      }
    ]
  }
] 