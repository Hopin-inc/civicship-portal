"use client";

import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { formatDateTime } from "@/utils/date";
import { ja } from "date-fns/locale";

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
const ReservationDetailsCard: React.FC<ReservationDetailsCardProps> = ({
  startDateTime,
  endDateTime,
  participantCount,
  location = { name: "高松市役所", address: "香川県高松市番町1丁目8-15" },
}) => {
  if (!startDateTime || !endDateTime) return null;

  return (
    <div className="bg-card rounded-lg py-6 px-4 mb-6 space-y-6">
      <div className="flex items-start gap-x-2">
        <Calendar size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-body-md">
            {formatDateTime(startDateTime, "yyyy年M月d日（E）", { locale: ja })}
          </span>
          <span className="text-body-md text-caption">
            {formatDateTime(startDateTime, "HH:mm")}-{formatDateTime(endDateTime, "HH:mm")}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-x-2">
        <MapPin size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-body-md">{location.name}</span>
          <span className="text-body-sm text-caption">{location.address}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsCard;
