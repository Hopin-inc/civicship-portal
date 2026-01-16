"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import React, { useCallback, useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { GqlOpportunityCategory } from "@/types/graphql";
import { displayDuration } from "@/utils/date";
import { Button } from "@/components/ui/button";
import SelectionSheet from "../../select-date/components/SelectionSheet";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";

type Props = {
  opportunity: ActivityCard | QuestCard;
  withShadow?: boolean;
  category?: GqlOpportunityCategory;
  startDateTime: Date | null;
  endDateTime: Date | null;
  participantCount: number;
  onChange: (newValue: number) => void;
};

export const ReservationConfirmationCard = ({
  opportunity,
  withShadow = true,
  category,
  startDateTime,
  endDateTime,
  participantCount,
  onChange,
}: Props) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleOpen = useCallback(() => setIsSheetOpen(true), []);
  const handleClose = useCallback(() => setIsSheetOpen(false), []);
  const link =
    category === GqlOpportunityCategory.Quest
      ? `/quests/${opportunity.id}?community_id=${opportunity.communityId}`
      : `/activities/${opportunity.id}?community_id=${opportunity.communityId}`;

  return (
    <>
      <Link href={link} className="block">
        <div className="mx-auto max-w-md">
          <div
            className={`flex overflow-hidden rounded-xl bg-background ${
              withShadow ? "shadow-lg" : ""
            }`}
          >
            <div className="relative h-[120px] w-[120px] flex-shrink-0">
              <SafeImage
                src={opportunity.images?.[0] ?? PLACEHOLDER_IMAGE}
                alt={opportunity.title}
                fill
                placeholder="blur"
                blurDataURL={PLACEHOLDER_IMAGE}
                loading="lazy"
                className="object-cover rounded-lg"
                fallbackSrc={PLACEHOLDER_IMAGE}
              />
            </div>
            <div className="flex-1 px-4 py-3">
              <h2 className="text-body-sm text-foreground line-clamp-4 font-bold leading-6">
                {opportunity.title}
              </h2>
            </div>
          </div>
          <div>
            <h2 className="text-label-sm font-bold pt-10">日時</h2>
            <p className="text-body-sm text-foreground pt-1 whitespace-pre-wrap">
              {displayDuration(
                startDateTime?.toISOString() ?? "",
                endDateTime?.toISOString() ?? "",
                true,
              )}
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
};
