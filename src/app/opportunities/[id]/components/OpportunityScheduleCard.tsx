"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { getCrossDayLabel } from "@/utils/date";
import { isActivitySlotType } from "@/components/domains/opportunities/types";

interface OpportunityScheduleCardProps {
  slot: ActivitySlot | QuestSlot;
  opportunityId: string;
  communityId: string;
}

export const OpportunityScheduleCard: React.FC<OpportunityScheduleCardProps> = ({
  slot,
  opportunityId,
  communityId,
}) => {
  const isFull = slot.remainingCapacity === 0;
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);
  
  return isFull
    ? renderFullSlotCard(slot)
    : renderAvailableSlotCard(slot, opportunityId, communityId);
};

const renderFullSlotCard = (slot: ActivitySlot | QuestSlot) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);

  const isFeeSpecified = isActivitySlotType(slot) && slot.feeRequired != null;
  const feeText = isFeeSpecified ? `${slot.feeRequired!.toLocaleString()}円` : "料金未定";
  const feeClass = `text-body-md font-bold ${!isFeeSpecified ? "text-gray-400" : "text-gray-400"}`;

  const crossDayLabel = getCrossDayLabel(startDate, endDate);

  return (
    <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-6 w-[280px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-title-md text-gray-500 font-bold mb-1">
          {format(startDate, "M月d日", { locale: ja })}
          <span className="text-label-sm text-gray-400">
            （{format(startDate, "E", { locale: ja })}）
          </span>
        </h3>
        <p className="text-body-md text-gray-400 mb-4">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          {crossDayLabel && (
            <span className="text-label-sm text-gray-400">（{crossDayLabel}）</span>
          )}
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <p className={feeClass}>{feeText}</p>
            {isFeeSpecified && <p className="text-body-sm ml-1 text-gray-300">/ 人</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Button disabled variant="tertiary" size="md" className="px-6">
          満席
        </Button>
      </div>
    </div>
  );
};

const renderAvailableSlotCard = (
  slot: ActivitySlot | QuestSlot,
  opportunityId: string,
  communityId: string,
) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);
  const isReservable = slot.isReservable;

  const isFeeSpecified = isActivitySlotType(slot) && slot.feeRequired != null;
  const feeText = isFeeSpecified ? `${slot.feeRequired!.toLocaleString()}円` : "料金未定";
  const feeClass = `text-body-md font-bold ${!isFeeSpecified ? "text-muted-foreground/50" : "text-caption"}`;

  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    guests: String(slot.applicantCount),
  });

  const href = `/reservation/confirm?${query.toString()}`;

  const crossDayLabel = getCrossDayLabel(startDate, endDate);

  return (
    <div className="bg-background rounded-xl border px-6 py-6 w-[280px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-title-md font-bold mb-1">
          {format(startDate, "M月d日", { locale: ja })}
          <span className="text-label-sm text-caption">
            （{format(startDate, "E", { locale: ja })}）
          </span>
        </h3>
        <p className="text-body-md text-foreground mb-4">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          {crossDayLabel && (
            <span className="text-label-sm text-caption">（{crossDayLabel}）</span>
          )}
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <p className={feeClass}>{feeText}</p>
            {isFeeSpecified && <p className="text-body-sm ml-1 text-caption">/ 人</p>}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 flex-col gap-2 items-center">
        {isReservable ? (
          <>
            {slot.remainingCapacity &&
              slot.remainingCapacity <= 10 &&
              slot.remainingCapacity > 0 && (
                <span className="text-xs text-primary font-medium">
                  定員まで残り{slot.remainingCapacity}名
                </span>
              )}
            <Link href={href} className="w-full">
              <Button variant="primary" size="md" className="w-full">
                この日程を選択
              </Button>
            </Link>
          </>
        ) : (
          <Button disabled variant="tertiary" size="md" className="w-full">
            予約受付終了
          </Button>
        )}
      </div>
    </div>
  );
};
