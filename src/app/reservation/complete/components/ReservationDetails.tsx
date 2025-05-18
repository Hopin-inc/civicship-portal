'use client';

import React from 'react';
import { Calendar, Clock1, Users, JapaneseYen } from 'lucide-react';

interface ReservationDetailsProps {
  formattedDate: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  totalPrice: number;
  pricePerPerson: number;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  formattedDate,
  startTime,
  endTime,
  participantCount,
  totalPrice,
  pricePerPerson
}) => {
  return (
    <div className="w-full bg-muted rounded-lg py-6 px-10 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
        <span>{formattedDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock1 className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
        <span>{startTime}-{endTime}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
        <span>{participantCount}人</span>
      </div>
      <div className="flex items-center gap-2">
        <JapaneseYen className="w-6 h-6 text-[#3F3F46]" strokeWidth={1.5} />
        <span>{totalPrice.toLocaleString()}円（{pricePerPerson.toLocaleString()}円 × {participantCount}人）</span>
      </div>
    </div>
  );
};

export default ReservationDetails;
