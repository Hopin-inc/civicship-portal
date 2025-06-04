"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { OpportunityCard } from "../../data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface OpportunityCardVerticalProps {
  opportunity: OpportunityCard;
  isCarousel?: boolean;
}

export default function OpportunityCardVertical({
  opportunity,
  isCarousel = false,
}: OpportunityCardVerticalProps) {
  const { id, title, location, images, hasReservableTicket, communityId } = opportunity;
  const feeRequired = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
  const pointsToEarn = 'pointsToEarn' in opportunity ? opportunity.pointsToEarn : null;

  return (
    <Link
      href={`/opportunities/${id}?community_id=${communityId}`}
      className={`relative w-full flex-shrink-0 ${isCarousel ? "max-w-[150px] sm:max-w-[164px]" : ""}`}
    >
      <Card className="w-full h-[205px] overflow-hidden relative">
        {hasReservableTicket && (
          <div className="absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10">
            チケット利用可
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
          <p className="text-body-sm text-muted-foreground">
            {feeRequired != null 
              ? `1人あたり${feeRequired.toLocaleString()}円から` 
              : pointsToEarn != null 
              ? `${pointsToEarn}ポイント獲得`
              : feeRequired === null && pointsToEarn === null 
              ? "料金未定" 
              : "ポイント未定"}
          </p>
          <div className="flex items-center text-body-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1 break-words">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
