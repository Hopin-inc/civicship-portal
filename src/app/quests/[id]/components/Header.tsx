"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import ImagesCarousel from "@/components/ui/DynamicImagesCarousel";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface HeaderProps {
  opportunity: QuestDetail;
}

export const Header: React.FC<HeaderProps> = ({
  opportunity,
}) => {
  const images = opportunity.images?.length ? opportunity.images : [PLACEHOLDER_IMAGE];

  return (
    <div className="relative w-full bg-background pb-6 max-w-mobile-l mx-auto">
      <ImagesCarousel images={images} title={opportunity.title} />
      <div>
        <h1 className="text-display-lg mb-4">{opportunity.title}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col -mt-1">
              <span className="text-body-md">{opportunity.place?.name || "場所未定"}</span>
              <span className="text-body-sm text-caption">{opportunity.place?.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

