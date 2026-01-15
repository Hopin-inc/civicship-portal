"use client";

import { SafeImage } from "@/components/ui/safe-image";
import CommunityLink from "@/components/navigation/CommunityLink";
import { Card } from "@/components/ui/card";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface OpportunityVerticalCardProps {
  title: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  price?: number | null;
  location?: string;
  pointsToEarn?: number | null;
  pointsRequired?: number | null;
  href?: string;
  onClick?: () => void;
  size?: "md" | "sm";
}

export default function OpportunityVerticalCard({
  title,
  image,
  imageAlt,
  badge,
  price,
  location,
  pointsToEarn,
  pointsRequired,
  href,
  onClick,
  size = "md",
}: OpportunityVerticalCardProps) {
  // Size configurations
  const sizeConfig = {
    md: {
      containerClass: "w-[164px]",
      cardClass: "h-[205px]",
      linkClass: "w-[164px]",
      sizes: "164px",
      titleClass: "text-title-sm font-bold",
      titleClamp: "line-clamp-2",
      spacing: "mt-3",
      metaSpacing: "mt-2",
    },
    sm: {
      containerClass: "w-[100px]",
      cardClass: "h-[100px]",
      linkClass: "w-[100px]",
      sizes: "100px",
      titleClass: "!text-label-xs",
      titleClamp: "line-clamp-1",
      spacing: "mt-2",
      metaSpacing: "mt-1",
    },
  };
  const config = sizeConfig[size];

  const CardContent = (
    <div className={`relative ${config.containerClass}`}>
      <Card className={`w-full ${config.cardClass} overflow-hidden relative`}>
        {badge && (
          <div
            className={`absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10`}
          >
            {badge}
          </div>
        )}
        <SafeImage
          src={image ?? PLACEHOLDER_IMAGE}
          alt={imageAlt ?? title}
          width={400}
          height={400}
          sizes={config.sizes}
          placeholder="blur"
          blurDataURL={PLACEHOLDER_IMAGE}
          loading="lazy"
          className="h-full w-full object-cover"
          fallbackSrc={PLACEHOLDER_IMAGE}
        />
      </Card>
      <div className={config.spacing}>
        <h3 className={cn(config.titleClass, config.titleClamp, "text-foreground")}>{title}</h3>
        <div className={`${config.metaSpacing} flex flex-col`}>
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
            <div className="flex items-center text-body-sm text-muted-foreground mt-1">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <p className="line-clamp-1 break-words">{location}</p>
            </div>
          )}
          {pointsToEarn != null && (
            <div className="flex items-center gap-1 pt-1">
              <span className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </span>
              <p className="text-body-sm font-bold">{pointsToEarn.toLocaleString()}ptもらえる</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <CommunityLink
        href={href}
        className={cn(
          "inline-block",
          config.linkClass,
          size === "md" && "mt-6",
          size === "sm" && "mt-2", // or 0
        )}
      >
        {CardContent}
      </CommunityLink>
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
