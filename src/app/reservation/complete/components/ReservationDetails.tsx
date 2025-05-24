"use client";

import React from "react";
import { Calendar, Clock1, Users, JapaneseYen, MapPin, Phone } from "lucide-react";
import TappablePhoneNumber from "@/components/shared/TappablePhoneNumber";

interface ReservationDetailsProps {
  formattedDate: string;
  startTime: string;
  endTime: string;
  participantCount: number;
  totalPrice: number;
  pricePerPerson: number;
  location?: {
    name: string;
    address: string;
  };
  phoneNumber?: string;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  formattedDate,
  startTime,
  endTime,
  participantCount,
  totalPrice,
  pricePerPerson,
  location = { name: "高松市役所", address: "香川県高松市番町1丁目8-15" },
  phoneNumber = "090-1234-5678",
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
      <div className="flex items-center gap-x-2">
        <JapaneseYen size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-row gap-x-2 items-center">
          <span className="text-foreground text-body-md">{totalPrice.toLocaleString()}円</span>
          <span className="text-caption text-body-sm">
            （{pricePerPerson.toLocaleString()}円 × {participantCount}
            人）
          </span>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Phone size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-row gap-x-2 items-center">
          <TappablePhoneNumber phoneNumber={phoneNumber} label="緊急連絡先" />
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
