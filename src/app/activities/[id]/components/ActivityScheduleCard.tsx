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
    <div className="bg-background rounded-xl border px-10 py-8 w-[280px] h-[316px] flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">
          {format(startDate, "M月d日", { locale: ja })}
          <span className="text-lg">（{format(startDate, "E", { locale: ja })}）</span>
        </h3>
        <p className="text-md text-muted-foreground mb-4">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
        </p>
        <p className="text-md text-muted-foreground mb-4">参加予定 {slot.applicantCount}人</p>
        <div className="space-y-2">
          <p className="text-lg font-bold">¥{slot.feeRequired?.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href={`/reservation/confirm?id=${opportunityId}&community_id=${communityId}&slot_id=${slot.id}&guests=${slot.applicantCount}`}
        >
          <Button variant="primary" size="selection">
            選択
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ActivityScheduleCard;
