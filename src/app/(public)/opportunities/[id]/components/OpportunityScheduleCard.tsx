"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ActivitySlot, QuestSlot } from "@/app/(authed)/reservation/data/type/opportunitySlot";
import { getCrossDayLabel } from "@/utils/date";

interface OpportunityScheduleCardProps {
  slot: ActivitySlot | QuestSlot;
  opportunityId: string;
  communityId: string;
  place?:number | null;
  points?:number | null;
  pointsRequired?:number | null;
}

export const OpportunityScheduleCard: React.FC<OpportunityScheduleCardProps> = ({
  slot,
  opportunityId,
  communityId,
  place,
  points,
  pointsRequired,
}) => {
  const isFull = slot.remainingCapacity === 0;
  return isFull
    ? renderFullSlotCard(slot, place, points, pointsRequired)
    : renderAvailableSlotCard(slot, opportunityId, communityId, place, points, pointsRequired);
};

const renderFullSlotCard = (slot: ActivitySlot | QuestSlot, price?:number | null, points?:number | null, pointsRequired?:number | null) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);

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
        <p className="text-body-md text-gray-400">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          {crossDayLabel && (
            <span className="text-label-sm text-gray-400">（{crossDayLabel}）</span>
          )}
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            {price === 0 && pointsRequired != null && pointsRequired > 0 ? (
              <p className="text-body-sm">
                <span className="text-body-md font-bold">
                  {pointsRequired.toLocaleString()}pt
                </span>
                /人
              </p>
            ) : price != null ? (
              <p className="text-body-sm">
                <span className="text-body-md font-bold">
                  {price.toLocaleString()}円
                </span>
                /人
              </p>
            ) : points == null ? (
              <p className="text-body-md font-bold text-muted-foreground/50">
                料金未定
              </p>
            ) : null}
          </div>
          {points != null && (
            <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </p>
              <p className="">
                <span className="text-body-md font-bold">{points.toLocaleString()}pt</span>
                <span className="text-body-sm">もらえる</span>
              </p>
            </div>
          )}
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
  price?:number | null,
  points?:number | null,
  pointsRequired?:number | null,
) => {
  const startDate = new Date(slot.startsAt);
  const endDate = new Date(slot.endsAt);
  const isReservable = slot.isReservable;

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
        <p className="text-body-md text-foreground">
          {format(startDate, "HH:mm")}〜{format(endDate, "HH:mm")}
          {crossDayLabel && (
            <span className="text-label-sm text-caption">（{crossDayLabel}）</span>
          )}
        </p>
        <div className="space-y-2">
          <div className="flex items-baseline">
            {price === 0 && pointsRequired != null && pointsRequired > 0 ? (
              <p className="text-body-sm">
                <span className="text-body-md font-bold">
                  {pointsRequired.toLocaleString()}pt
                </span>
                /人
              </p>
            ) : price != null ? (
              <p className="text-body-sm">
                <span className="text-body-md font-bold">
                  {price.toLocaleString()}円
                </span>
                /人
              </p>
            ) : points == null ? (
              <p className="text-body-md font-bold text-muted-foreground/50">
                料金未定
              </p>
            ) : null}
          </div>
          {points != null && (
            <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </p>
              <p className="">
                <span className="text-body-md font-bold">{points.toLocaleString()}pt</span>
                <span className="text-body-sm">もらえる</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-4 flex-col gap-2 items-center">
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
