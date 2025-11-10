"use client";

import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import Link from "next/link";
import Image from "next/image";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import React from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";

type Props = {
  title: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  price?: number | null;
  location?: string;
  pointsToEarn?: number | null;
  pointsRequired?: number | null;
  href?: string;
  withShadow?: boolean;
};

function OpportunityHorizontalCard({ title, image, imageAlt, badge, price, location, pointsToEarn, pointsRequired, href, withShadow = true }: Props) {
  return (
    <Link
      href={href ?? ""}
      className="block"
    >
      <div className="mx-auto max-w-md">
        <div
          className={`flex overflow-hidden rounded-xl bg-background ${
            withShadow ? "shadow-lg" : ""
          }`}
        >
          <div className="relative h-[108px] w-[88px] flex-shrink-0">
            <Image
              src={image ?? PLACEHOLDER_IMAGE}
              alt={imageAlt ?? title}
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
            <h2 className="text-title-sm text-foreground line-clamp-1">{title}</h2>
            {price !== undefined && (
              <div className="text-body-sm text-muted-foreground flex items-center gap-1">
                <JapaneseYenIcon className="w-4 h-4" />
                <p>{!price ? "参加無料" : `${price.toLocaleString()}円/人~`}</p>
              </div>
            )}
            {price === undefined && pointsRequired != null && pointsRequired > 0 && (
              <div className="text-body-sm text-muted-foreground flex items-center gap-1">
                <span className="text-[11px] rounded-full w-4 h-4 flex items-center justify-center border border-muted-foreground leading-none">
                  P
                </span>
                <p>{pointsRequired.toLocaleString()}pt/人~</p>
              </div>
            )}
            {location && (
              <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
                <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1 break-words">{location}</span>
              </div>
            )}
            {pointsToEarn != null && (
              <div className="flex items-center gap-1 pt-1">
                <span className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                  P
                </span>
                <p className="text-sm font-bold">
                  {pointsToEarn.toLocaleString()}ptもらえる
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default OpportunityHorizontalCard;
