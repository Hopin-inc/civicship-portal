"use client";

import React from "react";
import { ChevronRight, MapPin, Ticket } from "lucide-react";
import { ActivityDetail } from "@/app/activities/data/type";
import ImagesCarousel from "@/components/ui/images-carousel";

interface ActivityDetailsHeaderProps {
  opportunity: ActivityDetail;
  availableTickets: number;
}

const ActivityDetailsHeader: React.FC<ActivityDetailsHeaderProps> = ({
  opportunity,
  availableTickets,
}) => {
  const images = opportunity.images?.length
    ? opportunity.images
    : ["/placeholder.png", "/placeholder.png", "/placeholder.png"];

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

      {opportunity.reservableTickets.length > 0 && availableTickets > 0 && (
        <div className="flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-4 cursor-pointer hover:bg-primary-foreground/80">
          <Ticket className="w-5 h-5" />
          <p className="text-label-md">利用できるチケット</p>
          <p className="text-label-md font-bold">{availableTickets}枚</p>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </div>
      )}
    </div>
  );
};


export default ActivityDetailsHeader;
