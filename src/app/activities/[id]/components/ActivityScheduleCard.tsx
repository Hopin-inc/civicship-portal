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
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);

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
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <p className="text-body-md font-bold">{slot.feeRequired?.toLocaleString()}円</p>
            <p className="text-body-sm ml-1 text-caption">/ 人</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <Link
          href={`/reservation/confirm?id=${opportunityId}&community_id=${communityId}&slot_id=${slot.id}&guests=${slot.applicantCount}`}
        >
          <Button variant="primary" size="md" className="px-6">
            この日程を選択
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActivityScheduleCard;
