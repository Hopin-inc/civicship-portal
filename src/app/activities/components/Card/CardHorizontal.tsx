import { ActivityCard } from "@/app/activities/data/type";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import React from "react";

export function OpportunityCardHorizontal({ opportunity }: { opportunity: ActivityCard }) {
  return (
    <Link
      href={`/activities/${opportunity.id}`}
      className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent px-6 pb-8 pt-16"
    >
      <div className="mx-auto max-w-md">
        <div className="flex overflow-hidden rounded-xl bg-background shadow-lg">
          <div className="relative h-[108px] w-[88px] flex-shrink-0">
            <Image
              src={
                opportunity.images?.[0] ??
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
              }
              alt={opportunity.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 px-4 py-3">
            <h2 className="text-title-md text-foreground line-clamp-1">{opportunity.title}</h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              {opportunity.feeRequired
                ? `1人あたり${opportunity.feeRequired.toLocaleString()}円から`
                : "要問い合わせ"}
            </p>
            <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1 break-words">{opportunity.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
