'use client';

import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDateTime } from '@/utils/date';
import { ja } from 'date-fns/locale';
import { IconWrapper } from './IconWrapper';

interface ReservationDetailsCardProps {
  startDateTime: Date | null;
  endDateTime: Date | null;
  participantCount: number;
  location?: {
    name: string;
    address: string;
  };
}

/**
 * Component to display reservation details
 */
export const ReservationDetailsCard: React.FC<ReservationDetailsCardProps> = ({
  startDateTime,
  endDateTime,
  participantCount,
  location = { name: '高松市役所', address: '香川県高松市番町1丁目8-15' }
}) => {
  if (!startDateTime || !endDateTime) return null;
  
  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-6">
      <div className="flex items-center gap-3">
        <IconWrapper>
          <Calendar size={18} strokeWidth={1.5} />
        </IconWrapper>
        <div className="flex flex-col">
          <span className="text-base">
            {formatDateTime(startDateTime, "yyyy年M月d日（E）", { locale: ja })}
          </span>
          <span className="text-base text-gray-600">
            {formatDateTime(startDateTime, "HH:mm")}-
            {formatDateTime(endDateTime, "HH:mm")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <IconWrapper>
          <MapPin size={18} strokeWidth={1.5} />
        </IconWrapper>
        <div className="flex flex-col">
          <span className="text-base">{location.name}</span>
          <span className="text-sm text-gray-600">{location.address}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <IconWrapper>
          <Users size={18} strokeWidth={1.5} />
        </IconWrapper>
        <span className="text-base">{participantCount}人</span>
      </div>
    </div>
  );
};

export default ReservationDetailsCard;
