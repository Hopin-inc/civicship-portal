'use client';

import React from 'react';
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar, MapPin, Users, Banknote } from "lucide-react";
import type { Opportunity, Participation } from '@/types/participation';

interface ParticipationDetailsProps {
  opportunity: Opportunity;
  participation: Participation;
  startTime: Date;
  endTime: Date;
  participantCount: number;
}

export const ParticipationDetails: React.FC<ParticipationDetailsProps> = ({
  opportunity,
  participation,
  startTime,
  endTime,
  participantCount,
}) => {
  const duration = `${format(startTime, "HH:mm")}〜${format(endTime, "HH:mm")}`;

  return (
    <div className="p-2 my-6">
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p>{format(startTime, "yyyy年M月d日(E)", { locale: ja })}</p>
            <p>{duration}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p>{opportunity.location?.name || opportunity.place?.name}</p>
            <p className="text-sm text-muted-foreground">{opportunity.location?.address || opportunity.place?.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p>{participantCount}人</p>
        </div>

        {opportunity.feeRequired !== undefined && (
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p>{opportunity.feeRequired.toLocaleString()}円</p>
              <p className="text-sm text-gray-600">
                ({opportunity.feeRequired.toLocaleString()}円/人)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationDetails;
