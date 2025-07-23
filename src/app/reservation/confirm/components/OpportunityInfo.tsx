"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { formatDateTimeFromISO } from "@/utils/date";
import { GqlOpportunityCategory, GqlReservation } from "@/types/graphql";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | QuestDetail | null;
  dateTimeInfo?: {
    formattedDate: string;
    startTime: string;
    endTime: string;
  };
  participationCount?: number;
  phoneNumber?: string | null | undefined;
  comment?: string | null | undefined;
  totalPrice?: number;
}

const getPointOrFee = (opportunity: ActivityDetail | QuestDetail | null, totalPrice?: number) => {
  if(opportunity?.category === GqlOpportunityCategory.Activity) {
    return(
      <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
        <dt className="text-label-sm font-bold">当日お支払い金額</dt>
        <dd className="text-body-sm">{ totalPrice?.toLocaleString() }円</dd>
      </dl>
    )
  } else {
    const quest = opportunity as QuestDetail;
    return(
      <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
        <dt className="text-label-sm font-bold">獲得予定ポイント数</dt>
        <dd className="text-body-sm">{ quest.pointsToEarn?.toLocaleString() }pt</dd>
      </dl>
    )
  }
};

const OpportunityInfo: React.FC<OpportunityInfoProps> = ({ opportunity, dateTimeInfo, participationCount, phoneNumber, comment, totalPrice }) => {
  const slotDateTime = formatDateTimeFromISO(opportunity?.slots[0]?.startsAt ?? "", opportunity?.slots[0]?.endsAt ?? "");
  console.log(totalPrice);
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
          <dt className="text-label-sm font-bold">日時</dt>
          <dd className="text-body-sm">{ slotDateTime }</dd>
        </dl>
      ) } 
      { participationCount && (
        <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
          <dt className="text-label-sm font-bold">人数</dt>
          <dd className="text-body-sm">{ participationCount }人</dd>
        </dl>
      ) }
      { getPointOrFee(opportunity, totalPrice) }
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
