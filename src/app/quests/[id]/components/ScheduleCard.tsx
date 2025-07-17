"use client";

import React from "react";
import { AvailableSlotCard, FullSlotCard } from "./cards";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

interface ActivityScheduleCardProps {
  slot: ActivitySlot;
  opportunityId: string;
  communityId: string;
}

export const ScheduleCard: React.FC<ActivityScheduleCardProps> = ({
  slot,
  opportunityId,
  communityId,
}) => {
  const isFull = slot.remainingCapacity === 0;
  return isFull
    ? <FullSlotCard slot={slot} />
    : <AvailableSlotCard slot={slot} opportunityId={opportunityId} communityId={communityId} />
};


