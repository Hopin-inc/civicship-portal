"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

interface ActivityScheduleCardProps {
  slot: ActivitySlot;
  opportunityId: string;
  communityId: string;
}

const ActivityScheduleCard: React.FC<ActivityScheduleCardProps> = ({
  slot,
  opportunityId,
  communityId,
}) => {
  const isFull = slot.remainingCapacity === 0;
  return isFull
    ? renderFullSlotCard(slot)
    : renderAvailableSlotCard(slot, opportunityId, communityId);
};

const renderFullSlotCard = (slot: ActivitySlot) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);

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
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <p className="text-body-md text-gray-400 font-bold">
              {slot.feeRequired?.toLocaleString()}円
            </p>
            <p className="text-body-sm ml-1 text-gray-300">/ 人</p>
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
  slot: ActivitySlot,
  opportunityId: string,
  communityId: string,
) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);
  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    guests: String(slot.applicantCount),
  });
  const href = `/reservation/confirm?${query.toString()}`;

  return (
    <Link href={href}>
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
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline">
              <p className="text-body-md text-caption">{slot.feeRequired?.toLocaleString()}円</p>
              <p className="text-body-sm ml-1 text-caption">/ 人</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button variant="primary" size="md" className="px-6">
            この日程を選択
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ActivityScheduleCard;
