'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Participant {
  id: string;
  name: string;
  image: string | null;
}

interface PortfolioItemProps {
  id: string;
  type: 'opportunity' | 'activity_report' | 'quest';
  title: string;
  date: string;
  location: string | null;
  category: string;
  reservationStatus?: string | null;
  participants: Participant[];
  image: string | null;
  source?: string;
  lastItemRef?: React.RefObject<HTMLDivElement>;
}

export const UserPortfolioItem: React.FC<PortfolioItemProps> = ({
  id,
  type,
  title,
  date,
  location,
  category,
  reservationStatus,
  participants,
  image,
  source,
  lastItemRef
}) => {
  const getStatusLabel = (status: string | null | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'RESERVED':
        return '予約済み';
      case 'CANCELED':
        return 'キャンセル済み';
      case 'COMPLETED':
        return '完了';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category.toUpperCase()) {
      case 'QUEST':
        return 'クエスト';
      case 'ACTIVITY_REPORT':
        return '活動レポート';
      case 'INTERVIEW':
        return 'インタビュー';
      case 'OPPORTUNITY':
        return '機会';
      default:
        return category;
    }
  };

  const getPortfolioLink = () => {
    switch (type.toLowerCase()) {
      case 'opportunity':
        return `/activities/${id}`;
      case 'activity_report':
        return `/participations/${id}`;
      case 'quest':
        return `/quests/${id}`;
      default:
        return '#';
    }
  };

  const formattedDate = date ? format(new Date(date), 'yyyy年M月d日', { locale: ja }) : '';

  return (
    <div ref={lastItemRef} className="bg-background rounded-lg shadow-sm overflow-hidden mb-4">
      <Link href={getPortfolioLink()}>
        <div className="flex flex-col md:flex-row">
          {image && (
            <div className="relative w-full md:w-48 h-48 md:h-auto">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <span className="text-sm bg-muted text-foreground px-2 py-1 rounded">
                  {getCategoryLabel(category)}
                </span>
                {reservationStatus && (
                  <span className="text-sm bg-primary-foreground text-primary px-2 py-1 rounded">
                    {getStatusLabel(reservationStatus)}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            
            {location && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="mr-1">📍</span>
                {location}
              </div>
            )}
            
            {participants.length > 0 && (
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500 mr-2">参加者:</span>
                <div className="flex -space-x-2">
                  {participants.slice(0, 3).map((participant) => (
                    <div key={participant.id} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={participant.image || '/placeholder-profile.jpg'}
                        alt={participant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {participants.length > 3 && (
                    <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-background">
                      +{participants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserPortfolioItem;
