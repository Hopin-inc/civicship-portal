'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket as TicketIcon, Star as StarIcon } from 'lucide-react';

interface UserTicketsAndPointsProps {
  ticketCount: number;
  pointCount: number;
}

export const UserTicketsAndPoints: React.FC<UserTicketsAndPointsProps> = ({
  ticketCount,
  pointCount
}) => {
  return (
    <div className="space-y-2 mt-8">
      <Link href="/tickets">
        <div className="bg-[#EEF0FF] p-4 rounded-lg flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-[#4361EE]" />
            <span className="text-[#4361EE]">
              利用可能なチケットが
              <span className="font-bold">
                {ticketCount}
              </span>
              枚あります。
            </span>
          </div>
          <span className="text-[#4361EE]">›</span>
        </div>
      </Link>
      <Link href="/wallets">
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span>保有ポイント</span>
            <span className="font-bold">
              {pointCount}pt
            </span>
          </div>
          <span className="text-gray-500">›</span>
        </div>
      </Link>
    </div>
  );
};

export default UserTicketsAndPoints;
