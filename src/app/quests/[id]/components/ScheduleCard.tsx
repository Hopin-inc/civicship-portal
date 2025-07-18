"use client";

import React from "react";
import { AvailableSlotCard, FullSlotCard } from "./cards";
import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

interface ActivityScheduleCardProps {
  slot: QuestSlot;
  opportunityId: string;
  communityId: string;
  pointsToEarn: number;
}

export const ScheduleCard: React.FC<ActivityScheduleCardProps> = ({
  slot,
  opportunityId,
  communityId,
  pointsToEarn,
}) => {
  const isFull = slot.remainingCapacity === 0;
  return isFull
    ? <FullSlotCard slot={slot} pointsToEarn={pointsToEarn} />
    : <AvailableSlotCard slot={slot} opportunityId={opportunityId} communityId={communityId} pointsToEarn={pointsToEarn} />
};


