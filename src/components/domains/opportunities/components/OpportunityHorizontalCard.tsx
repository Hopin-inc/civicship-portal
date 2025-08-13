"use client";

import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import Link from "next/link";
import Image from "next/image";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import React from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";

type Props = {
  opportunity: ActivityCard | QuestCard;
  withShadow?: boolean;
  href: string;
  price?: string;
  location?: string;
};

function OpportunityHorizontalCard({ opportunity, withShadow = true, href, price, location }: Props) {
  return (
    <Link
      href={href}
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
            <h2 className="text-title-sm text-foreground line-clamp-1">{opportunity.title}</h2>
            <p className="mt-1 text-body-sm text-muted-foreground flex items-center gap-1">
              <JapaneseYenIcon className="w-4 h-4" />
              {!price ? "参加無料" : `${price}円/人~`}
            </p>
            {location && (
              <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
                <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1 break-words">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default OpportunityHorizontalCard;