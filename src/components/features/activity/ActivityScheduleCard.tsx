'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ActivityScheduleCardProps {
  startsAt: string;
  endsAt: string;
  participants: number;
  price: number;
  opportunityId: string;
  communityId: string;
  isReservableWithTicket?: boolean;
  availableTickets?: number;
}

const ActivityScheduleCard: React.FC<ActivityScheduleCardProps> = ({
  startsAt,
  endsAt,
  participants,
  price,
  opportunityId,
  communityId,
  isReservableWithTicket,
  availableTickets,
}) => {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  return (
    <div className="bg-white rounded-xl border px-10 py-8 w-[280px] h-[316px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">
          {format(startDate, "M月d日", { locale: ja })}
          <span className="text-lg">（{format(startDate, "E", { locale: ja })}）</span>
        </h3>
        <p className="text-md text-gray-600 mb-4">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
        </p>
        <p className="text-md text-gray-500 mb-4">参加予定 {participants}人</p>
        <div className="space-y-2">
          <p className="text-lg font-bold">¥{price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href={`/reservation/confirm?id=${opportunityId}&starts_at=${startsAt}`}
        >
          <Button variant="primary" size="selection">
            選択
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActivityScheduleCard;
