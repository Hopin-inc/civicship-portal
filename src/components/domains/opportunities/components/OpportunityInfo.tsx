"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { displayDuration } from "@/utils/date";
import { GqlOpportunityCategory } from "@/types/graphql";
import Link from "next/link";
import { getPointOrFee } from "@/utils/opportunity/displayPointsOrFee";
import { ArrowRight } from "lucide-react";

interface OpportunityInfoProps {
  opportunity: ActivityDetail | QuestDetail;
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
  variant?: "complete" | "participation";
}

const OpportunityInfo: React.FC<OpportunityInfoProps> = ({
  opportunity,
  dateTimeInfo,
  participationCount,
  phoneNumber,
  comment,
  totalPrice,
  ticketCount,
  variant = "complete",
}) => {
  const isComplete = variant === "complete";
  const slotDateTime = displayDuration(
    opportunity?.slots[0]?.startsAt ?? "",
    opportunity?.slots[0]?.endsAt ?? "",
    isComplete
  );
  const link =
    opportunity.category === GqlOpportunityCategory.Quest
      ? `/quests/${opportunity.id}?community_id=${opportunity.communityId}`
      : `/activities/${opportunity.id}?community_id=${opportunity.communityId}`;

  return (
    <div
      className={
        isComplete
          ? "mx-6 my-6 border border-foreground-caption rounded-lg p-4"
          : "mx-6 my-6 rounded-lg"
      }
    >
      <Link
        href={link}
        className={isComplete ? "" : "flex justify-between items-center gap-4"}
      >
        {isComplete ? (
          <div className="flex justify-between items-center gap-4">
            <div className="relative w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={opportunity.images?.[0] || PLACEHOLDER_IMAGE}
                alt={opportunity.title ?? ""}
                fill
                placeholder={"blur"}
                blurDataURL={PLACEHOLDER_IMAGE}
                className="object-cover"
              />
            </div>
            <div className="flex items-center">
              <h1 className="text-body-sm font-bold mb-4 line-clamp-4 break-words leading-6">
                {opportunity.title ?? ""}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-[80px] h-[80px] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={opportunity.images?.[0] || PLACEHOLDER_IMAGE}
                alt={opportunity.title ?? ""}
                fill
                placeholder={"blur"}
                blurDataURL={PLACEHOLDER_IMAGE}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-title-md font-bold leading-tight mb-4 line-clamp-3 break-words">
                {opportunity.title ?? ""}
              </h1>
            </div>
            <ArrowRight size={20} className="text-primary flex-shrink-0" />
          </>
        )}
      </Link>
      {dateTimeInfo && (
        <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
          <dt className="text-label-sm font-bold w-24">日時</dt>
          <dd className={`text-body-sm ${isComplete ? "whitespace-pre-wrap" : ""}`}>
            {slotDateTime}
          </dd>
        </dl>
      )}
      {participationCount && (
        <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
          <dt className="text-label-sm font-bold">人数</dt>
          <dd className="text-body-sm">{participationCount}人</dd>
        </dl>
      )}
      {getPointOrFee({
        opportunity,
        totalPrice,
        pointsRequired: opportunity?.pointsRequired,
        participantCountWithPoint: dateTimeInfo?.participantCountWithPoint,
        participantCount: participationCount,
        ticketCount,
      })}
      {phoneNumber && (
        <dl
          className={`flex justify-between py-5 mt-2 items-center ${comment ? "border-b border-foreground-caption" : ""}`}
        >
          <div className={isComplete ? "flex flex-col gap-y-1" : "flex flex-col gap-y-2"}>
            <dt className="text-label-sm font-bold">緊急連絡先</dt>
            <dt className={isComplete ? "text-body-xs" : "text-label-sm font-bold"}>
              主催者の電話番号
            </dt>
          </div>
          <div className="flex flex-col gap-y-2">
            <a href={`tel:${phoneNumber}`} className="text-body-md text-primary underline">
              {phoneNumber}
            </a>
          </div>
        </dl>
      )}
      {comment && (
        <dl className="py-5 mt-2">
          <dt className="text-label-sm font-bold">主催者への伝言</dt>
          <dd className="text-body-sm mt-2">{comment}</dd>
        </dl>
      )}
    </div>
  );
};

export default OpportunityInfo;
