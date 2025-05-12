"use client";

import React from "react";
import Image from "next/image";
import { ActivityDetail } from "@/app/activities/data/type";

interface ActivitySummaryProps {
  opportunity: ActivityDetail;
}

/**
 * Component to display a summary of the activity that was reserved
 */
export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ opportunity }) => {
  return (
    <div className="w-full bg-background rounded-lg mb-4">
      <div className="flex gap-4 p-4">
        <div className="relative w-[72px] h-[72px] shrink-0">
          <Image
            src={opportunity.images?.[0] || "/placeholder.png"}
            alt={opportunity.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-base font-medium mb-2">{opportunity.title}</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>1人あたり{opportunity.feeRequired?.toLocaleString() || "0"}円から</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{opportunity.place.name || "場所未定"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
