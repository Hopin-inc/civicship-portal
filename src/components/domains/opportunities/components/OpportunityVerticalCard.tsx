"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { JapaneseYenIcon, MapPin } from "lucide-react";

interface OpportunityVerticalCardProps {
  title: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  price?: number | null;
  location?: string;
  pointsToEarn?: number | null;
  href?: string;
  onClick?: () => void;
}

export default function OpportunityVerticalCard({
  title,
  image,
  imageAlt,
  badge,
  price,
  location,
  pointsToEarn,
  href,
  onClick,
}: OpportunityVerticalCardProps) {

  const CardContent = (
    <div className="relative w-[164px]">
      <Card className="w-full h-[205px] overflow-hidden relative">
        {badge && (
          <div className={`absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10`}>
            {badge}
          </div>
        )}
        <Image
          src={image || PLACEHOLDER_IMAGE}
          alt={imageAlt || title}
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
          {price !== undefined && (
            <div className="text-body-sm text-muted-foreground flex items-center gap-1">
              <JapaneseYenIcon className="w-4 h-4" />
              {!price ? "参加無料" : `${price}円/人~`}
            </div>
          )}
          {location && (
            <div className="flex items-center text-body-sm text-muted-foreground mt-1">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1 break-words">{location}</span>
            </div>
          )}
          {pointsToEarn != null && (
            <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </p>
              <p className="text-sm font-bold">
                {pointsToEarn.toLocaleString()}ptもらえる
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block w-[164px] mt-6">
        {CardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {CardContent}
      </button>
    );
  }

  return CardContent;
}
