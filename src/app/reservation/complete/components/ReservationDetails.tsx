"use client";

import React from "react";
import { Calendar, JapaneseYen, MapPin, Phone, Users } from "lucide-react";
import { GqlOpportunityCategory } from "@/types/graphql";

interface ReservationDetailsProps {
  formattedDate: string;
  dateDiffLabel: string | null;
  startTime: string;
  endTime: string;
  participantCount: number;
  paidParticipantCount: number;
  totalPrice: number;
  pricePerPerson: number | null;
  location?: {
    name: string;
    address: string;
  };
  phoneNumber?: string | null | undefined;
  isReserved?: boolean;
  points?: {
    usedPoints: number;
    participantCountWithPoint: number;
  } | null;
  ticketCount: number;
  category: GqlOpportunityCategory;
  pointsToEarn: number;
}

const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  formattedDate,
  dateDiffLabel,
  startTime,
  endTime,
  participantCount,
  paidParticipantCount,
  totalPrice,
  pricePerPerson,
  location = {
    name: "高松市役所",
    address: "香川県高松市番町1丁目8-15",
  },
  phoneNumber,
  isReserved = false,
  points,
  ticketCount,
  category,
  pointsToEarn,
}) => {
  const normalParticipantCount = participantCount - ticketCount - (points?.participantCountWithPoint ?? 0);
  return (
    <div className="bg-card rounded-lg py-6 px-4 mb-6 space-y-6 w-full">
      <div className="flex items-start gap-x-2">
        <Calendar size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-body-md">{formattedDate}</span>
          <span className="text-body-md text-caption">
            { startTime }-{ endTime }
            { dateDiffLabel && (
              <span className="text-sm text-caption">（{dateDiffLabel}）</span>
            )}
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
      { category === GqlOpportunityCategory.Activity ? (
      <div className="flex items-center gap-x-2">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <JapaneseYen size={18} strokeWidth={1.5} className="text-caption w-6 h-6 mt-0.5" />
            <div className="flex justify-between items-center">
              <span className="text-foreground text-body-md">{ totalPrice?.toLocaleString() }円</span>
            </div>
          </div>
          
          {/* 内訳セクション */}
          <div className="bg-muted rounded-lg p-4 mt-2">
            <div className="space-y-2">
              <h2 className="text-body-xs text-caption font-bold">内訳</h2>
              {/* 通常申し込み */}
              <div className="flex justify-between text-body-xs text-muted-foreground mt-1 border-b border-foreground-caption pb-2">
                <span className="">通常申し込み</span>
                <div>
                  <span>{ pricePerPerson?.toLocaleString() }円</span>
                  <span className="mx-2">×</span>
                  <span>{ normalParticipantCount }名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{ (pricePerPerson ?? 0) * normalParticipantCount }円</span>
                </div>
              </div>

              {/* ポイント利用 */}
              { points && points.usedPoints > 0 && points.participantCountWithPoint > 0 ? (
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>ポイント利用</span>
                <div>
                  <span>{ points?.usedPoints?.toLocaleString() }pt</span>
                  <span className="mx-2">×</span>
                  <span>{ points?.participantCountWithPoint }名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{ (points?.usedPoints ?? 0) * (points?.participantCountWithPoint ?? 0) }pt</span>
                  </div>
                </div>
              ) : null }

              {/* チケット利用 */}
              { ticketCount > 0 ? (
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>チケット利用</span>
                <div>
                  <span>{ ticketCount }名分</span>
                </div>
              </div>
              ) : null }
            </div>
          </div>
        </div>
      </div>
      ) : null }
      { category === GqlOpportunityCategory.Quest ? (
        <div className="flex items-center gap-1 pt-1">
        <p className="bg-primary text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold text-white leading-none">
          P
        </p>
        <p className="text-body-md font-bold">
            +{pointsToEarn.toLocaleString()}ポイント
        </p>
      </div>
      ) : null }
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
