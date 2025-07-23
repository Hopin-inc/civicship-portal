"use client";

import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { GqlOpportunityCategory } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import SelectionSheet from "../reservation/select-date/components/SelectionSheet";

type Props = {
  opportunity: ActivityCard | QuestCard;
  withShadow?: boolean;
  category?: GqlOpportunityCategory;
  startDateTime: Date | null;
  endDateTime: Date | null;
  participantCount: number;
  onChange: (newValue: number) => void;
};

export const CardHorizontal = ({ opportunity, withShadow = true, category, startDateTime, endDateTime, participantCount, onChange }: Props) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleOpen = useCallback(() => setIsSheetOpen(true), []);
  const handleClose = useCallback(() => setIsSheetOpen(false), []);

  return (
    <>
      <Link
        href={`/activities/${opportunity.id}?community_id=${opportunity.communityId}`}
        className="block"
      >
        <div className="mx-auto max-w-md">
          <div
            className={`flex overflow-hidden rounded-xl bg-background ${
              withShadow ? "shadow-lg" : ""
            }`}
          >
            <div className="relative h-[120px] w-[120px] flex-shrink-0">
              <Image
                src={opportunity.images?.[0] ?? PLACEHOLDER_IMAGE}
                alt={opportunity.title}
                fill
                placeholder="blur"
                blurDataURL={PLACEHOLDER_IMAGE}
                loading="lazy"
                className="object-cover rounded-lg"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
            <div className="flex-1 px-4 py-3">
              <h2 className="text-title-sm text-foreground line-clamp-4">{opportunity.title}</h2>
            </div>
          </div>
          <div>
            <h2 className="text-label-sm font-bold pt-10">日時</h2>
            <p className="text-body-sm text-foreground pt-1">
              {formatDateTime(startDateTime, "yyyy年M月d日(E) ", { locale: ja })}
              {formatDateTime(startDateTime, "HH:mm")}-{formatDateTime(endDateTime, "HH:mm")}
            </p>
          </div>
          <div className="border-b border-gray-200 my-4"></div>
        </div>
      </Link>
      <div>
        <div className="flex items-center justify-between gap-x-2">
          <div>
            <h2 className="text-label-sm font-bold">人数</h2>
            <p className="text-body-sm text-foreground pt-1">{participantCount}人</p>
          </div>
          <Button variant="tertiary" size="sm" onClick={handleOpen} className={"px-6"}>
            変更
          </Button>
        </div>
        <SelectionSheet
          isOpen={isSheetOpen}
          onClose={handleClose}
          activeForm="guests"
          selectedDate={null}
          setSelectedDate={() => {}}
          selectedGuests={participantCount}
          setSelectedGuests={onChange}
          dateSections={[]} // ゲストのみ使うので空でOK
        />
      </div>
    </>
  );
}
