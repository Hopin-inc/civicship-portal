"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { displayDuration } from "@/utils/date";
import { GqlOpportunityCategory } from "@/types/graphql";
import { ArrowRight } from "lucide-react";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | QuestDetail | null;
  dateTimeInfo?: {
    formattedDate: string;
    startTime: string;
    endTime: string;
    participantCountWithPoint: number;
    usedPoints: number;
  };
  participationCount?: number;
  phoneNumber?: string | null | undefined;
  comment?: string | null | undefined;
  totalPrice?: number;
  ticketCount?: number;
}

const getPointOrFee = (
  opportunity: ActivityDetail | QuestDetail | null,
  totalPrice?: number,
  pointsRequired?: number,
  participantCountWithPoint?: number,
  participantCount?: number,
  ticketCount?: number
) => {
  if(opportunity?.category === GqlOpportunityCategory.Activity) {
    const feeRequired = "feeRequired" in opportunity ? opportunity.feeRequired : 0;
    const normalParticipantCount = (participantCount ?? 0) - (ticketCount ?? 0) - (participantCountWithPoint ?? 0);
    return(
      <div className="border-b border-foreground-caption pb-4">
        <dl className="flex justify-between py-2 mt-2 items-center">
          <div>
            <dt className="text-label-sm font-bold">当日お支払い金額</dt>
            <p className="text-body-xs text-caption pt-1">料金は現地でお支払いください</p>
          </div>
          <dd className="text-body-sm">{ totalPrice?.toLocaleString() }円</dd>
        </dl>
        <div className="bg-muted rounded-lg p-4">
            <div className="space-y-2">
              <h2 className="text-body-xs text-caption font-bold">内訳</h2>
              {/* 通常申し込み */}
              <div className="flex justify-between text-body-xs text-muted-foreground mt-1 border-b border-foreground-caption pb-2">
                <span className="">通常申し込み</span>
                <div>
                  <span>{ feeRequired?.toLocaleString() }円</span>
                  <span className="mx-2">×</span>
                  <span>{ normalParticipantCount }名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{ (feeRequired ?? 0) * normalParticipantCount }円</span>
                </div>
              </div>

              {/* ポイント利用 */}
              { pointsRequired && pointsRequired > 0 && participantCountWithPoint && participantCountWithPoint > 0 && (
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>ポイント利用</span>
                <div>
                  <span>{ pointsRequired?.toLocaleString() }pt</span>
                  <span className="mx-2">×</span>
                  <span>{ participantCountWithPoint }名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{ (pointsRequired ?? 0) * (participantCountWithPoint ?? 0) }pt</span>
                  </div>
                </div>
              ) }

              {/* チケット利用 */}
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>チケット利用</span>
                <div>
                  <span>{ ticketCount }名分</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  } else {
    const quest = opportunity as QuestDetail;
    return(
      <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
        <dt className="text-label-sm font-bold">獲得予定ポイント数</dt>
        <dd className="text-body-sm">{( (quest.pointsToEarn ?? 0) * (participantCount ?? 0)).toLocaleString() }pt</dd>
      </dl>
    )
  }
};

const OpportunityInfo: React.FC<OpportunityInfoProps> = ({
   opportunity, 
   dateTimeInfo, 
   participationCount, 
   phoneNumber, 
   comment, 
   totalPrice,
   ticketCount
 }) => {
  const slotDateTime = displayDuration(opportunity?.slots[0]?.startsAt ?? "", opportunity?.slots[0]?.endsAt ?? "");

  return (
    <div className="mx-6 my-6 border border-foreground-caption rounded-lg p-4">
      <div className="flex justify-between items-center gap-4">
        <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={opportunity?.images?.[0] || PLACEHOLDER_IMAGE}
            alt={opportunity?.title ?? ""}
            fill
            placeholder={"blur"}
            blurDataURL={PLACEHOLDER_IMAGE}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-title-md font-bold leading-tight mb-4 line-clamp-3 break-words">
            {opportunity?.title ?? ""}
          </h1>
        </div>
        <ArrowRight size={20} className="text-primary flex-shrink-0" />
      </div>
      { dateTimeInfo && (
        <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
          <dt className="text-label-sm font-bold w-24">日時</dt>
          <dd className="text-body-sm">{ slotDateTime }</dd>
        </dl>
      ) } 
      { participationCount && (
        <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
          <dt className="text-label-sm font-bold">人数</dt>
          <dd className="text-body-sm">{ participationCount }人</dd>
        </dl>
      ) }
      { getPointOrFee(
          opportunity,
          totalPrice,
          opportunity?.pointsRequired,
          dateTimeInfo?.participantCountWithPoint,
          participationCount,
          ticketCount
        ) }
      { phoneNumber && (
      <dl className={`flex justify-between py-5 mt-2 items-center ${comment ? "border-b border-foreground-caption" : ""}`}>
        <div className="flex flex-col gap-y-2">
          <dt className="text-label-sm font-bold">緊急連絡先</dt>
          <dt className="text-label-sm font-bold">主催者の電話番号</dt>
        </div>
        <div className="flex flex-col gap-y-2">
          <a
            href={ `tel:${ phoneNumber }` }
            className="text-body-md text-primary underline"
          >
            { phoneNumber }
          </a>
          </div>
        </dl>
      ) }
      { comment && (
        <dl className="py-5 mt-2">
          <dt className="text-label-sm font-bold">主催者への伝言</dt>
          <dd className="text-body-sm mt-2">{ comment }</dd>
        </dl>
      ) }
    </div>
  );
};

export default OpportunityInfo;
