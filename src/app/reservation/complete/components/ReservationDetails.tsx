"use client";

import React from "react";
import { Calendar, JapaneseYen, MapPin, Phone, Star, Users } from "lucide-react";

interface ReservationDetailsProps {
  formattedDate: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  paidParticipantCount: number;
  totalPrice: number;
  pricePerPerson: number | null;
  pointsToEarn: number | null;
  location?: {
    name: string;
    address: string;
  };
  phoneNumber?: string | null | undefined;
  isReserved?: boolean;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  formattedDate,
  startTime,
  endTime,
  participantCount,
  paidParticipantCount,
  totalPrice,
  pricePerPerson,
  pointsToEarn,
  location = {
    name: "高松市役所",
    address: "香川県高松市番町1丁目8-15",
  },
  phoneNumber,
  isReserved = false,
}) => {
  return (
    <div className="bg-card rounded-lg py-6 px-4 mb-6 space-y-6 w-full">
      <div className="flex items-start gap-x-2">
        <Calendar size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-body-md">{formattedDate}</span>
          <span className="text-body-md text-caption">
            {startTime}-{endTime}
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
      <div className="flex items-center gap-x-2">
        <Users size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <span>{participantCount}人</span>
      </div>
      {pricePerPerson !== null && totalPrice !== null && (
        <div className="flex items-center gap-x-2">
          <JapaneseYen size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
          <div className="flex flex-row gap-x-2 items-center">
            <span className="text-foreground text-body-md">{totalPrice.toLocaleString()}円</span>
            <span className="text-caption text-body-sm">
              （{pricePerPerson.toLocaleString()}円 × {paidParticipantCount.toLocaleString()}人）
            </span>
          </div>
        </div>
      )}
      {pointsToEarn !== null && (
        <div className="flex items-center gap-x-2">
          <Star size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5 rotate-90" />
          <span className="text-body-md">{pointsToEarn.toLocaleString()}pt 獲得予定</span>
        </div>
      )}
      <div className="flex items-center gap-x-2">
        {isReserved ? (
          phoneNumber ? (
            <>
              <Phone size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
              <div className="flex flex-row gap-x-2 items-center">
                <a
                  href={`tel:${phoneNumber}`}
                  className="text-body-md text-primary hover:underline"
                >
                  {phoneNumber}
                </a>
                <span className="text-caption text-body-sm">（緊急連絡先）</span>
              </div>
            </>
          ) : (
            <span className="text-body-sm text-caption">
              緊急時は公式LINEからお問い合わせください。
            </span>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ReservationDetails;
