"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface OpportunityCardProps {
  id: string;
  title: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  price?: string;
  priceIcon?: React.ReactNode;
  location?: string;
  locationIcon?: React.ReactNode;
  pointsToEarn?: string;
  href?: string;
  onClick?: () => void;
}

export default function OpportunityCard({...props}: OpportunityCardProps) {

  const CardContent = (
    <div className="relative w-[164px] flex-shrink-0 mt-6">
      <Card className="w-full h-[205px] overflow-hidden relative">
        {props.badge && (
          <div className={`absolute top-2 left-2 bg-primary-foreground text-primary px-2.5 py-1 rounded-xl text-label-xs font-bold z-10`}>
            {props.badge}
          </div>
        )}
        <Image
          src={props.image || PLACEHOLDER_IMAGE}
          alt={props.imageAlt || props.title}
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
        <h3 className="text-title-sm text-foreground line-clamp-2">{props.title}</h3>
        <div className="mt-2 flex flex-col">
          {props.price && (
            <div className="text-body-sm text-muted-foreground flex items-center gap-1">
              {props.priceIcon}
              {props.price}
            </div>
          )}
          {location && (
            <div className="flex items-center text-body-sm text-muted-foreground mt-1">
              {props.locationIcon}
              <span className="line-clamp-1 break-words">{props.location}</span>
            </div>
          )}
          {props.pointsToEarn != null && (
            <div className="flex items-center gap-1 pt-1">
              <p className="bg-primary text-[11px] rounded-full w-4 h-4 flex items-center justify-center font-bold text-white leading-none">
                P
              </p>
              <p className="text-sm font-bold">
                {props.pointsToEarn}ptもらえる
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (props.href) {
    return (
      <Link href={props.href}>
        {CardContent}
      </Link>
    );
  }

  if (props.onClick) {
    return (
      <button onClick={props.onClick} className="w-full text-left">
        {CardContent}
      </button>
    );
  }

  return CardContent;
}
