"use client";

import Image from "next/image";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { GqlOpportunityCategory } from "@/types/graphql";

interface OpportunityCardVerticalProps {
  opportunity: ActivityCard | QuestCard;
  isCarousel?: boolean;
}

const selectBadge = (hasReservableTicket: boolean | null, pointsToRequired: boolean | null) => {
  switch (true) {
    case hasReservableTicket && pointsToRequired:
      return "チケット利用可";
    case hasReservableTicket:
      return "チケット利用可";
    case pointsToRequired:
      return "ポイントが使える";
    default:
      return null;
  }
}

const getLink = (id: string, communityId: string, category: GqlOpportunityCategory) => {
  if (category === GqlOpportunityCategory.Activity) {
    return `/activities/${id}?community_id=${communityId}`;
  } else if (category === GqlOpportunityCategory.Quest) {
    return `/quests/${id}?community_id=${communityId}`;
  }
  return "";
}

export default function OpportunityCardVertical({
  opportunity,
  isCarousel = false,
}: OpportunityCardVerticalProps) {
  const { id, title, location, images, hasReservableTicket, communityId,category} = opportunity;
  const feeRequired = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
  const pointsToRequired = 'pointsToRequired' in opportunity ? opportunity.pointsToRequired : null;
  const pointsToEarn = 'pointsToEarn' in opportunity ? opportunity.pointsToEarn : null;
  return (
    <Link
      href={getLink(id, communityId, category)}
      className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[150px] sm:max-w-[164px]" : ""}`}
    >
      <Card className="w-full h-[205px] overflow-hidden relative">
        {(hasReservableTicket || pointsToRequired) && (
          <div className="absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10">
            {selectBadge(hasReservableTicket, pointsToRequired)}
          </div>
        )}
        <Image
          src={images?.[0] || PLACEHOLDER_IMAGE}
          alt={title}
          width={400}
          height={400}
          sizes="164px"
          placeholder={`blur`}
          blurDataURL={PLACEHOLDER_IMAGE}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = PLACEHOLDER_IMAGE;
          }}
        />
      </Card>
      <div className="mt-3">
        <h3 className="text-title-sm text-foreground line-clamp-2">{title}</h3>
        <div className="mt-2 flex flex-col">
          <div className="text-body-sm text-muted-foreground">
            {category === GqlOpportunityCategory.Activity
            ? <p className="text-body-sm text-muted-foreground flex items-center gap-1"><JapaneseYenIcon className="w-4 h-4" /> {feeRequired?.toLocaleString()}円/人~</p> 
            :category === GqlOpportunityCategory.Quest
            ? <p className="text-body-sm text-muted-foreground flex items-center gap-1"><JapaneseYenIcon className="w-4 h-4" /> 参加無料</p>
            : "料金未定"
            }
          </div>
          <div className="flex items-center text-body-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 break-words">{location}</span>
          </div>
          {pointsToEarn != null && pointsToEarn > 0 && category === GqlOpportunityCategory.Quest && (
            <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] p-1 rounded-full w-4 h-4 flex items-center justify-center pt-[6px] font-bold text-white">P</p>
              <p className="text-sm font-bold">
                  {pointsToEarn}ptもらえる
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
