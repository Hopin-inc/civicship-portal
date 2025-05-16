'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket as TicketIcon, Star as StarIcon, ChevronRight } from 'lucide-react';

interface UserTicketsAndPointsProps {
  ticketCount: number;
  pointCount: number;
}

export const UserTicketsAndPoints: React.FC<UserTicketsAndPointsProps> = ({
  ticketCount,
  pointCount
}) => {
  return (
    <div className="space-y-2 mt-2">
      <Link href="/tickets">
        <div className="flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-2 cursor-pointer hover:bg-primary-foreground/80">
          <TicketIcon className="w-5 h-5 mb-0.5" />
          <p className="text-label-md">利用できるチケット</p>
          <p className="text-label-md font-bold">{ticketCount}枚</p>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </div>
      </Link>
      <Link href="/wallets">
        <div className="flex items-center gap-2 bg-muted text-caption rounded-lg px-4 py-3 mt-2 cursor-pointer hover:bg-muted/80">
          <StarIcon className="w-5 h-5 mb-0.5" />
          <p className="text-label-md">保有ポイント</p>
          <p className="text-label-md font-bold">{pointCount}pt</p>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </div>
      </Link>
    </div>
  );
};

export default UserTicketsAndPoints;
