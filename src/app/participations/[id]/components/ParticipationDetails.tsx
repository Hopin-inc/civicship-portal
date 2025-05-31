"use client";

import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Banknote, Calendar, MapPin, Users } from "lucide-react";
import type { ParticipationDetail } from "@/app/participations/[id]/data/type";
import { ActivityCard } from "@/app/activities/data/type";

interface ParticipationDetailsProps {
  opportunity: ActivityCard;
  participation: ParticipationDetail;
}

const ParticipationDetails: React.FC<ParticipationDetailsProps> = ({
  opportunity,
  participation,
}) => {
  const duration = `${format(participation.slot.startsAt, "HH:mm")}〜${format(participation.slot.endsAt, "HH:mm")}`;

  return (
    <div className="p-2 my-6">
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p>{format(participation.slot.startsAt, "yyyy年M月d日(E)", { locale: ja })}</p>
            <p>{duration}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p>{participation.place.name || ""}</p>
            <p className="text-sm text-muted-foreground">{participation.place.address || ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p>{participation.participantsCount}人</p>
        </div>

        {opportunity.feeRequired !== undefined && (
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p>{opportunity.feeRequired?.toLocaleString()}円</p>
              <p className="text-sm text-gray-600">
                ({opportunity.feeRequired?.toLocaleString()}円/人)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationDetails;
